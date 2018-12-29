import { Injectable } from '@angular/core';
import { FormGroup, FormArray, FormControl, FormBuilder, AbstractControl, ValidationErrors } from '@angular/forms';
import { Observable } from 'rxjs';

import { SensorService } from '../sensor.service';
import { SensorMeasureMetaData, SensorMeasureTypeDetails, SensorMeasureType } from './../sensor.classes';


@Injectable()
export class SensorHistorySelectorFormService {

  public form: FormGroup;
  private _measureTypesByLocationMap = new Map<string, Array<SensorMeasureMetaData>>();


  public static toStringTime(date: Date): string {
    return date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
  }

  constructor(public sensorService: SensorService, private fb: FormBuilder) {
    this.form  = this.fb.group({
      sensorsIdentification : this.fb.group({
        locations : this.fb.array([]),
        locationsMeasures: this.fb.array([])}),
      timeInterval: this.fb.group({
        from: this.fb.group({
          date: this.fb.control(this.defaultDate(), (fc) => this.rawDateValidator(fc)),
          time: this.fb.control(this.defaultTime()),
        }),
        to: this.fb.group({
          date: this.fb.control(this.defaultDate(), (fc) => this.rawDateValidator(fc)),
          time: this.fb.control(this.defaultTime()),
        },
        (fg) => this.datePrecedenceValidator(fg)
      )
      })
    });
    this.subscribeInternalListeners();
  }

  private defaultDate(): string {
    return this.toStringDate(new Date());
  }

  private defaultTime(): any {
    const date = new Date();
    const time: string = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
    return time;
  }

  private subscribeInternalListeners(): void {
    this.locations.valueChanges.subscribe(locationsVal => {
      const selectedLocations: Array<string> = locationsVal
          .filter(location => location.isSelected)
          .map( location => location.location);
      this.setLocationMeasures(this.getMeasureTypesByLocation(selectedLocations));
    });
  }

  get locationsMeasures(): FormArray {
    return this.form.get('sensorsIdentification').get('locationsMeasures') as FormArray;
  }

  get locations(): FormArray {
    return this.form.get('sensorsIdentification').get('locations') as FormArray;
  }

  get timeInterval(): FormGroup {
    return this.form.get('timeInterval')as FormGroup;
  }

  private getDate(toOrFrom: string): string {
    return this.timeInterval.get(toOrFrom).get('date').value;
  }

  public getToDateStd(): Date {
    return this.parseDate(this.getDate('to'));
  }

  public getFromDateStd(): Date {
    return this.parseDate(this.getDate('from'));
  }

  public datePrecedenceValidator(control: AbstractControl): ValidationErrors {
    const fromDateCg = control.get('from').get('date');
    const toDateCg = control.get('to').get('date');
    if (!fromDateCg || !toDateCg) {
      return null;
    }
    const fromDate: Date = this.parseDate(fromDateCg.value);
    const toDate: Date = this.parseDate(toDateCg.value);
    if (!fromDate || !toDate) {
      return null;
    }
    if (fromDate > toDate) {
      return {datePrecedence: true};
    }
  }

  public rawDateValidator(control: AbstractControl): ValidationErrors {
    if (!control) {
      return;
    }

    let validationResult = null;
    if (!control.value || !this.isRawDateValid(control.value)) {
      console.error('Invalid raw date: ' + control.value);
      // control.setErrors({rawDate: true});
      validationResult = {rawDate: true};
    } else {
      console.log('Valid raw date: ' + control.value);
      // control.setErrors({rawDate: false});
    }

    return validationResult;
  }

  public isRawDateValid(date: string): Boolean {
    if (date && date.match(/^[0-9]{1,4}-[0-9]{1,2}-[0-9]{1,2}$/)) {
      const dateElements: Array<string> =  date.split('-');
      const month: number = +dateElements[1];
      const day: number = +dateElements[2];
      return (month >= 1 && month <= 12 && day >= 1 && day <= 31);
    }
    return false;
  }

  // Expected format : yyyy-mm-dd
  private parseDate(date: string): Date {
    if (!this.isRawDateValid(date)) { return null; }
    const dateElements: Array<string> =  date.split('-');
    return new Date(+dateElements[0], +dateElements[1] - 1, +dateElements[2]);
  }

  private toStringDate(date: Date): string {
    const dateString: string = date.getFullYear() + '-'  + (date.getMonth() + 1) + '-' + date.getDate();
    return dateString;
  }

  public updateToDate(date: Date): void {
    this.updateDate('to', date);
  }

  public updateFromDate(date: Date): void {
    this.updateDate('from', date);
  }

  private updateDate(toOrFrom: string, date: Date): void {
    const dateFc: FormControl = this.timeInterval.get(toOrFrom).get('date') as FormControl;
    if (date) {
      dateFc.setValue(this.toStringDate(date));
    } else {
      dateFc.reset();
    }
  }

  public updateToTime(date: Date): void {
    this.updateTime('to', date);
  }

  public updateFromTime(date: Date): void {
    this.updateTime('from', date);
  }

  private updateTime(toOrFrom: string, date: Date): void {
    const dateFc: FormControl = this.timeInterval.get(toOrFrom).get('time') as FormControl;
    if (date) {
      dateFc.setValue(SensorHistorySelectorFormService.toStringTime(date));
    } else {
      dateFc.reset();
    }
  }


  public refreshFormData(): FormGroup {
    this.sensorService
      .loadMeasurekeys()
      .subscribe((backendMeasureKeys) => this.updateFormData(backendMeasureKeys));
    return this.form;
  }

  private updateFormData(newMeasureKeys: Array<SensorMeasureMetaData>) {
    this.updateLocalSensorCache(newMeasureKeys);
    this.updateSelectableLocations(this.getAllStoredLocations(), false);
  }

  private updateLocalSensorCache(newMeasureKeys: Array<SensorMeasureMetaData>) {
    this._measureTypesByLocationMap = new Map<string, Array<SensorMeasureMetaData>>();
    newMeasureKeys.forEach(measureKey => {
      if (this._measureTypesByLocationMap.has(measureKey.location)) {
        this._measureTypesByLocationMap.get(measureKey.location).push(measureKey);
      } else {
        this._measureTypesByLocationMap.set(measureKey.location, [measureKey]);
      }
    });
  }

  private getAllStoredLocations(): Array<string> {
    const newLocations: Array<string> = [];
    this._measureTypesByLocationMap.forEach( (_, location: string) => newLocations.push(location));
    return newLocations;
  }

  private getMeasureTypesByLocation(locations: Array<string> ): Map<string, Array<SensorMeasureMetaData>> {
    const selectedMeasuresByLocation = new Map<string, Array<SensorMeasureMetaData>>();
    locations.forEach(location =>
      selectedMeasuresByLocation.set(location, this._measureTypesByLocationMap.get(location)));
    return selectedMeasuresByLocation;
  }

  private updateSelectableLocations(newLocations: Array<String>, initialSelectionValue: Boolean): void {
    this.locations.controls.splice(0);
    newLocations.forEach(( location: string) => {
        this._measureTypesByLocationMap.get(location);
        const locationGroup = this.fb.group({
          location,
          isSelected: this.fb.control(initialSelectionValue)
        });
        this.locations.push(locationGroup);
      }
    );
  }

  private setLocationMeasures(measureTypesByLocationMap: Map<string, Array<SensorMeasureMetaData>>): void {
    this.locationsMeasures.controls.splice(0);
    measureTypesByLocationMap.forEach(
      (measureTypes: SensorMeasureMetaData[], location: string) => {
        const locationMeasures: FormGroup =  this.fb.group({
          location,
          measures : this.fb.array([])
        });

        measureTypes.forEach((measureKey) => {
          (locationMeasures.get('measures') as FormArray).push(
            this.fb.group({
              measureKey,
              measureTypeName : SensorMeasureMetaData.getTypeDetail(measureKey.type).typeName,
              isSelected: this.fb.control(false)
            }));
        });

        this.locationsMeasures.push(locationMeasures);
    });
  }

  public isMeasureTypesByLocationEmtpy(): Boolean {
    return this.locationsMeasures.length === 0;
  }

  public toggleAllLocations(): void {
    if (this.isMeasureTypesByLocationEmtpy()) {
      this.updateSelectableLocations(this.getAllStoredLocations(), true);
    } else {
      this.updateSelectableLocations(this.getAllStoredLocations(), false);
    }
  }

  public emitNewSubmission(): void {
    if (!this.canSubmit()) {
      console.error('Invalid form' + JSON.stringify(this.form.errors));
      return;
    }
    const selectedMeasures: Array<SensorMeasureMetaData> = this.extractMeasureSelection();
    console.log('SensorHistorySelectorFormService ~> selectedMeasures: '
      + JSON.stringify(selectedMeasures));
    // TODO: extract timesmap intervall & emit new data to form result consumers
  }

  public extractMeasureSelection(): Array<SensorMeasureMetaData> {
    const measureKeysSelection: Array<SensorMeasureMetaData> = [];
    this.locationsMeasures.controls.forEach(locationMeasures => {
      (locationMeasures.get('measures') as FormArray).controls.forEach(measure => {
        if (measure.get('isSelected').value) {
          measureKeysSelection.push(measure.get('measureKey').value);
        }
      });
    });
    return measureKeysSelection;
  }

  public canSubmit(): Boolean {
    return this.form.valid
      && this.hasAtLeastOneMeasureSelected();
  }

  private hasAtLeastOneMeasureSelected(): Boolean {
    return this.locationsMeasures.length !== 0
      && this.locationsMeasures.controls
          .some(locationMeasures =>
              (locationMeasures.get('measures') as FormArray).controls
                  .some(measure => measure.get('isSelected').value));
  }

}
