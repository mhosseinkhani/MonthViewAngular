import { Component, OnInit, OnChanges, SimpleChanges, EventEmitter, Output, Input } from "@angular/core";
import * as moment from 'moment';
import * as _ from 'lodash';
@Component({
  selector: "month-view",
  providers: [],
  templateUrl: "./month-view.component.html",
  styleUrls: ["./month-view-component.min.css"]
})
export class MonthViewComponent implements OnInit, OnChanges {
  @Input() selectedDates: CalendarDate[] = [];
  @Output() onSelectDate = new EventEmitter<CalendarDate>();

  constructor();
}

hasChange: boolean = false; // for active change month and year
currentDate = moment();
dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
weeks: CalendarDate[][] = [];
sortedDates: CalendarDate[] = [];


ngOnInit(): void {
  this.generateCalendar();
}

ngOnChanges(changes: SimpleChanges): void {
  if(changes.selectedDates &&
    changes.selectedDates.currentValue &&
    changes.selectedDates.currentValue.length > 1) {
    // sort on date changes for better performance when range checking
    this.sortedDates = _.sortBy(changes.selectedDates.currentValue, (m: CalendarDate) => m.mDate.valueOf());
    this.generateCalendar();
  }
}

// date checkers
isToday(date: moment.Moment): boolean {
  return moment().isSame(moment(date), 'day');
}

isSelected(date: moment.Moment): boolean {
  return _.findIndex(this.selectedDates, (selectedDate) => {
    return moment(date).isSame(selectedDate.mDate, 'day');
  }) > -1;
}

isSelectedMonth(date: moment.Moment): boolean {
  return moment(date).isSame(this.currentDate, 'month');
}

selectDate(date: CalendarDate): void {
  this.onSelectDate.emit(date);
}

// actions from calendar
prevMonth(): void {
  this.currentDate = moment(this.currentDate).subtract(1, 'months');
  this.generateCalendar();
}

nextMonth(): void {
  this.currentDate = moment(this.currentDate).add(1, 'months');
  this.generateCalendar();
}

firstMonth(): void {
  this.currentDate = moment(this.currentDate).startOf('year');
  this.generateCalendar();
}

lastMonth(): void {
  this.currentDate = moment(this.currentDate).endOf('year');
  this.generateCalendar();
}

prevYear(): void {
  this.currentDate = moment(this.currentDate).subtract(1, 'year');
  this.generateCalendar();
}

nextYear(): void {
  this.currentDate = moment(this.currentDate).add(1, 'year');
  this.generateCalendar();
}

// generate the calendar grid
generateCalendar(): void {
  debugger;
  const dates = this.fillDates(this.currentDate);
  const weeks: CalendarDate[][] = [];
  while(dates.length > 0) {
    weeks.push(dates.splice(0, 7));
  }
    this.weeks = weeks;
}

fillDates(currentMoment: moment.Moment): CalendarDate[] {
  const firstOfMonth = moment(currentMoment).startOf('month').day();
  const firstDayOfGrid = moment(currentMoment).startOf('month').subtract(firstOfMonth, 'days');

  const start = firstDayOfGrid.date();
  return _.range(start, start + 42)
    .map((date: number): CalendarDate => {
      const d = moment(firstDayOfGrid).date(date);
      return {
        today: this.isToday(d),
        selected: this.isSelected(d),
        mDate: d,
      };
    });
}
}

export interface CalendarDate {
  mDate: moment.Moment;
  selected?: boolean;
  today?: boolean;
}