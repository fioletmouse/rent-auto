import { Injectable } from '@nestjs/common';
import * as moment from 'moment';

@Injectable()
export class BLService {
  constructor() {}

  moreThanDayLimit = (start: Date, end: Date) => {
    const mEnd = moment(end);
    const mStart = moment(start);
    const daysCount =  mEnd.diff(mStart, 'days') + 1;
    return daysCount > 30;
  }

  private isWeekendDay = (date: Date) => {
    const weekDayNum = moment(date).day();
    return weekDayNum === 6 || weekDayNum === 0 // Sat || Sun;
  }

  isWeekendDates = (start: Date, end: Date) => {
    return this.isWeekendDay(start) || this.isWeekendDay(end);
  }
}