import { Injectable } from '@angular/core';
import { FormGroup, FormArray, FormControl, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';

import { SensorService } from '../sensor.service';
import { SensorMeasureMetaData, SensorMeasureTypeDetails, SensorMeasureType } from './../sensor.classes';


@Injectable()
export class SensorHistorySelectorFormService {

  public form: FormGroup;
  private _measureTypesByLocationMap = new Map<string, Array<SensorMeasureMetaData>>();

  constructor(public sensorService: SensorService, private fb: FormBuilder) {
    this.form  = this.fb.group({
      sensorsIdentification : this.fb.group({
        locations : this.fb.array([]),
        locationsMeasures: this.fb.array([])})
      });
    this.subscribeInternalListeners();
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
