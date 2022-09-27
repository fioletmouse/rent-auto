import { Inject, Injectable } from '@nestjs/common';
import * as moment from 'moment';
import { BLService } from 'src/bl/bl.service';
import { DBService } from 'src/db/db.service';
import Const from '../constants';
import { RentInput } from './rent.dto';

@Injectable()
export class RentService {
  constructor(
    private readonly bl: BLService,
    @Inject(Const.DATABASE_MODULE) private connection: DBService) {}

  async isAvailable(rentInput: RentInput): Promise<boolean> {
    const { id, start, end } = rentInput;
    // if(this.bl.moreThanDayLimit(start, end)) {

    // }

    const res = await this.connection.query(
      'SELECT * FROM book_session WHERE auto_id = $1 AND (\
        (start_date <= $2 AND end_date >= $3) OR \
        (start_date >= $2 AND end_date >= $3 AND $3 >= start_date) OR \
        (start_date <= $2 AND end_date <= $3 AND $2 <= end_date) \
      )', 
      [id, start, end]
    );
    return res.rowCount === 0 ;
  }

  // max day check
  // start-end check
  // interval between booking
  // swagger return errors
  // logger
  async prelimCalc(rentInput: RentInput): Promise<number> {
    const { start, end } = rentInput;
    const res = await this.connection.query('SELECT * FROM rate WHERE $1 BETWEEN start_date AND end_date ORDER BY "from" ASC', [start]);
    const rates = res.rows;
    const a = moment(end);
    const b = moment(start);

    const daysCount =  a.diff(b, 'days') + 1; // 1
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
