import { Inject, Injectable } from '@nestjs/common';
import { DBService } from 'src/db/db.service';
import Const from '../constants';

@Injectable()
export class RentService {
  constructor(@Inject(Const.DATABASE_MODULE) private connection: DBService) {}

  async isAvailable(): Promise<boolean> {
    const res = await this.connection.query('SELECT * FROM test', null);
    console.log(res.rows);
    // await pool.end();
    return true;
  }
}
