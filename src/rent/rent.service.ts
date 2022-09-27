import { Inject, Injectable } from '@nestjs/common';
import { UtilsService } from 'src/bl/utils.service';
import { CalcService } from 'src/bl/calc.service';
import { DBService } from 'src/db/db.service';
import Const from '../constants';
import { RentInput, RentOutput } from './rent.dto';

@Injectable()
export class RentService {
  constructor(
    private readonly utils: UtilsService,
    private readonly calc: CalcService,
    @Inject(Const.DATABASE_MODULE) private connection: DBService) {}

  async isAvailable(rentInput: RentInput): Promise<RentOutput<boolean>> {
    const { id, start, end } = rentInput;
    const output: RentOutput<boolean> = { result: null, warnings: []}

    // warnings
    if(this.utils.moreThanDayLimit(start, end)) {
      output.warnings.push('You check period that is more than 30 days. Booking will be unavailable.')
    }
    if(this.utils.isWeekendDates(start, end)) {
      output.warnings.push('Start or end date is a weekend day. Booking will be unavailable.')
    }

    const res = await this.connection.query(
      'SELECT * FROM book_session WHERE auto_id = $1 AND (\
        (start_date <= $2 AND end_date >= $3) OR \
        (start_date >= $2 AND end_date >= $3 AND $3 >= start_date) OR \
        (start_date <= $2 AND end_date <= $3 AND $2 <= end_date) \
      )', 
      [id, start, end]
    );
    output.result = res.rowCount === 0
    return output;
  }

  // max day check
  // start-end check
  // interval between booking
  // swagger return errors
  // logger
  async prelimCalc(rentInput: RentInput): Promise<RentOutput<number>> {
    const { start, end } = rentInput;
    const res = await this.connection.query('SELECT * FROM rate WHERE $1 BETWEEN start_date AND end_date ORDER BY "from" ASC', [start]);
    const rates = res.rows;

    const daysCount =  this.utils.daysCount(start, end)
    let daysLeft = daysCount;

    const totalSum = rates.reduce((sum, rate) => {
      if(daysLeft > 0) {
        const periodDays = rate.to - rate.from + 1;
        const percentage = rate.percentage ? rate.percentage / 100 : 0;
        const payment = rate.rate - rate.rate * percentage
        if(daysLeft >= periodDays) {
          sum += periodDays * payment;
        } else {
          sum += daysLeft * payment;
        }
        daysLeft = daysLeft - periodDays;
      }
      return sum;
    }, 0);

    return totalSum;
  }

  async book(rentInput: RentInput): Promise<boolean> {
    const { id, start, end } = rentInput;
    const isAvailable = await this.isAvailable(rentInput);
    if(isAvailable) {
      const total = await this.prelimCalc(rentInput);
      // save
      try {
        const queryText = 'INSERT INTO book_session(auto_id, start_date, end_date, total) VALUES($1, $2, $3, $4)';
        const res = await this.connection.singleCommand(queryText, [id, start, end, total]);
        return res.rowCount > 0;
      } catch(err) {
        throw err;
      } 
    }
    return false;
  }
}
