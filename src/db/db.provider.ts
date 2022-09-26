import { DBService } from './db.service';
import { ConfigService } from '@nestjs/config';
import Const from '../constants';

export const dbProvider = {
  provide: Const.DATABASE_MODULE,
  inject: [ConfigService],
  useFactory: (configService: ConfigService): DBService => {
    return new DBService(configService);
  },
};
