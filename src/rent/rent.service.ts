import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import { UtilsService } from 'src/bl/utils.service';
import { CalcService } from 'src/bl/calc.service';
import { DBService } from 'src/db/db.service';
import Const from '../constants';
import { IRate, RentInput, IRentOutput } from './rent.dto';

@Injectable()
export class RentService {
  constructor(
    private readonly utils: UtilsService,
    private readonly calc: CalcService,
    @Inject(Const.DATABASE_MODULE) private connection: DBService) {}

  async isAvailable(rentInput: RentInput): Promise<IRentOutput<boolean>> {
    const { id, start, end } = rentInput;
    const output: IRentOutput<boolean> = { result: null, warnings: []}

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

  // interval between booking
  // logger
  async prelimCalc(rentInput: RentInput): Promise<IRentOutput<number>> {
    const { start, end } = rentInput;
    const res = await this.connection.query('SELECT * FROM rate WHERE $1 BETWEEN start_date AND end_date ORDER BY "from" ASC', [start]);
    const rates: IRate[] = res.rows.map((row) => ({ from: row.from, to: row.to, rate: row.rate, percentage: row.percentage }));

    const daysCount =  this.utils.daysCount(start, end)
    const totalSum = this.calc.prelimitCalculation(rates, daysCount);
    return { result: totalSum, warnings: []};
  }

  async book(rentInput: RentInput): Promise<IRentOutput<boolean>> {
    const { id, start, end } = rentInput;
    const isAvailable = await this.isAvailable(rentInput);

    // no way to book a car that is not met the conditions
    if(isAvailable.warnings.length > 0) throw new BadRequestException(isAvailable.warnings.join(' '));
    if(!isAvailable.result) throw new BadRequestException('Car is unavailable. Please, try other dates.');

    const total = (await this.prelimCalc(rentInput)).result;
    // save
    try {
      const queryText = 'INSERT INTO book_session(auto_id, start_date, end_date, total) VALUES($1, $2, $3, $4)';
      const res = await this.connection.singleCommand(queryText, [id, start, end, total]);
      return { result: res.rowCount > 0, warnings: []};
    } catch(err) {
      throw err;
    } 
  }
}
