import { Component, Input, OnInit, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormArray, FormControl, FormBuilder } from '@angular/forms';

import { SensorMeasureMetaData, SensorMeasureTypeDetails, SensorMeasureType } from './../../sensor.classes';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-sensor-identification',
  templateUrl: './sensor-identification.component.html',
  styleUrls: ['./sensor-identification.component.scss']
})
export class SensorIdentificationComponent implements OnInit, OnChanges {

  @Input() measureKeys: Array<SensorMeasureMetaData>;
  @Output() selectedMeasureKeys = new EventEmitter<Array<SensorMeasureMetaData>>();

  private measureTypesByLocationMap = new Map<string, Array<SensorMeasureMetaData>>();

  public form: FormGroup;


  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.form  = this.fb.group({
      locations : this.fb.array([]),
      locationsMeasures: this.fb.array([])
    });

    this.locations.valueChanges.subscribe(locationsVal => {
      console.log('change in location' + JSON.stringify(locationsVal));
      this.setLocationMeasures(
        this.getMeasureTypesByLocation(
          locationsVal.filter(location => location.isSelected)
                    .map( location => location.location)));
    });
  }

  private getMeasureTypesByLocation(locations: Array<string> ): Map<string, Array<SensorMeasureMetaData>> {
    const selectedMeasuresByLocation = new Map<string, Array<SensorMeasureMetaData>>();
    locations.forEach(location =>
      selectedMeasuresByLocation.set(location, this.measureTypesByLocationMap.get(location)));
    return selectedMeasuresByLocation;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.measureKeys.currentValue != null) {
      this.updateSelectableKeys(changes.measureKeys.currentValue);
    }
  }

  toggleAllLocations(): void {
    if (this.isMeasureTypesByLocationEmtpy()) {
      this.setLocationMeasures(this.measureTypesByLocationMap);
    } else {
      this.setLocationMeasures(new Map());
    }
  }

  isMeasureTypesByLocationEmtpy(): Boolean {
    return this.locationsMeasures.length === 0;
  }

  get locations(): FormArray {
    return this.form.get('locations') as FormArray;
  }

  get locationsMeasures(): FormArray {
    return this.form.get('locationsMeasures') as FormArray;
  }

  private updateSelectableKeys(newMeasureKeys: Array<SensorMeasureMetaData>) {
    this.measureTypesByLocationMap = new Map<string, Array<SensorMeasureMetaData>>();
    newMeasureKeys.forEach(measureKey => {
      if (this.measureTypesByLocationMap.has(measureKey.location)) {
        this.measureTypesByLocationMap.get(measureKey.location).push(measureKey);
      } else {
        this.measureTypesByLocationMap.set(measureKey.location, [measureKey]);
      }
    });

    this.setLocations(this.measureTypesByLocationMap);
  }

  private setLocations(measureTypesByLocationMap: Map<string, Array<SensorMeasureMetaData>>): void {
    this.locations.reset();
    this.measureTypesByLocationMap.forEach(
      (measureTypes: SensorMeasureMetaData[], location: string) => {
        const locationGroup = this.fb.group({
          location,
          isSelected: this.fb.control(false)
        });
        this.locations.push(locationGroup);
      }
    );
  }

  private setLocationMeasures(measureTypesByLocationMap: Map<string, Array<SensorMeasureMetaData>>): void {
    this.locationsMeasures.controls.splice(0);
    measureTypesByLocationMap.forEach(
      (measureTypes: SensorMeasureMetaData[], location: string) => {
        console.log('location ' + location);
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

  canSubmit(): Boolean {
    return this.locationsMeasures.controls.some(locationMeasures =>
      (locationMeasures.get('measures') as FormArray).controls.some(measure =>
        measure.get('isSelected').value)
      ) && this.locationsMeasures.length !== 0;
  }

  onSubmit() {
    console.log('submit');
    if (!this.form.valid || !this.canSubmit()) {
      console.error('Invalid form' + JSON.stringify(this.form.errors));
      return;
    }
    const measureKeysSelection: Array<SensorMeasureMetaData> = [];
    this.locationsMeasures.controls.forEach(locationMeasures => {
      (locationMeasures.get('measures') as FormArray).controls.forEach(measure => {
        if (measure.get('isSelected').value) {
          measureKeysSelection.push(measure.get('measureKey').value);
        }
      });
    });
    this.selectedMeasureKeys.emit(measureKeysSelection);
  }
}
