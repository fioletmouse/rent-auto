import { Inject, Injectable } from '@nestjs/common';
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
    const res = await this.connection.query(
      'SELECT * FROM book_session WHERE auto_id = $1 AND (\
        (start_date <= $2 AND end_date >= $3) OR \
        (start_date >= $2 AND end_date >= $3 AND $3 >= start_date) OR \
        (start_date <= $2 AND end_date <= $3 AND $2 <= end_date) \
      )', 
      [id, start, end]
    );
    return res.rows.rowCount === 0 ;
  }

  // max day check
  // start-end check
  async prelimCalc(rentInput: RentInput): Promise<number> {
    const { id, start, end } = rentInput;
    const res = await this.connection.query('SELECT * FROM rate WHERE $1 BETWEEN start_date AND end_date', [start]);
    const rate = res.rows;
    return 0
  }
}
