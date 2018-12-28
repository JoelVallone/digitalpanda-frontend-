import { Component, Input, OnInit, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormArray, FormControl, FormBuilder } from '@angular/forms';
import {NgbDate, NgbCalendar, NgbTimeStruct} from '@ng-bootstrap/ng-bootstrap';

import { SensorMeasureMetaData, SensorMeasureTypeDetails, SensorMeasureType } from './../../sensor.classes';
import { map } from 'rxjs/operators';
import { SensorHistorySelectorFormService } from '../sensor-history-selector-form.service';

@Component({
  selector: 'app-time-interval-selector',
  templateUrl: './time-interval-selector.component.html',
  styleUrls: ['./time-interval-selector.component.scss']
})
export class TimeIntervalSelectorComponent {

  @Input() public timeIntervalForm: FormGroup;

  fromDate: NgbDate;
  toDate: NgbDate;
  displayDatePicker: Boolean;
  hoveredDate: NgbDate;

  fromTime: NgbTimeStruct;
  toTime: NgbTimeStruct;

  constructor(calendar: NgbCalendar, public formService: SensorHistorySelectorFormService) {
    /**/
    const now: Date = new Date();
    this.fromTime = this.toFormViewTime(now);
    this.toTime = this.toFormViewTime(now);
    this.setDefaultDates();
    this.displayDatePicker = false;
  }

  private setDefaultInterval() {
    this.setDefaultDates();
  }

  private setDefaultDates() {
    const now: Date = new Date();
    this.fromDate = this.toFormViewDate(now); // calendar.getToday()
    this.toDate =  this.toFormViewDate(now); // calendar.getNext(calendar.getToday(), 'd', 10);
    this.updateToDate(this.toDate);
    this.updateFromDate(this.fromDate);
  }

  private toFormViewDate(date: Date): NgbDate {
    return new NgbDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
  }

  private toStdDate(viewDate: NgbDate): Date {
    return viewDate ? new Date(viewDate.year, viewDate.month - 1, viewDate.day) :  null ;
  }

  private toFormViewTime(date: Date): NgbTimeStruct {
    return{hour: date.getHours(), minute: date.getMinutes(), second: date.getSeconds()};
  }

  private updateToDate(date: NgbDate): void {
    this.formService.updateToDate(this.toStdDate(date));
  }

  private updateFromDate(date: NgbDate): void {
    this.formService.updateFromDate(this.toStdDate(date));
  }

  public toggleDatePicker() {
    this.fromDate = this.toFormViewDate(this.formService.getFromDateStd());
    this.toDate =  this.toFormViewDate(this.formService.getToDateStd());
    if (!this.fromDate || !this.toDate) {
      this.setDefaultDates();
    }
    this.displayDatePicker = !this.displayDatePicker;
  }

  // ================== datepicker view logic ====================
  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && (date.after(this.fromDate) || date.equals(this.fromDate))) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
    this.updateToDate(this.toDate);
    this.updateFromDate(this.fromDate);
  }

  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) {
    return date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return date.equals(this.fromDate) || date.equals(this.toDate) || this.isInside(date) || this.isHovered(date);
  }

}
