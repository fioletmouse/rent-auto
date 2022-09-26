import { Inject, Injectable } from '@nestjs/common';
import { DBService } from 'src/db/db.service';
import Const from '../constants';
import { RentInput } from './rent.dto';

@Injectable()
export class RentService {
  constructor(@Inject(Const.DATABASE_MODULE) private connection: DBService) {}

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
}
