import { Component, Input, OnInit, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormArray, FormControl, FormBuilder } from '@angular/forms';

import { SensorMeasureMetaData, SensorMeasureTypeDetails, SensorMeasureType } from './../../sensor.classes';

@Component({
  selector: 'app-sensor-identification',
  templateUrl: './sensor-identification.component.html',
  styleUrls: ['./sensor-identification.component.scss']
})
export class SensorIdentificationComponent implements OnInit, OnChanges {

  @Input() measureKeys: Array<SensorMeasureMetaData>;
  @Output() selectedMeasureKeys = new EventEmitter<Array<SensorMeasureMetaData>>();

  public form;

  get locationsMeasures(): FormArray {
    return this.form.get('locationsMeasures') as FormArray;
  }

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.form  = this.fb.group({
      locationsMeasures: this.fb.array([])
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.updateSelectableKeys(changes.measureKeys.currentValue);
  }

  private updateSelectableKeys(newMeasureKeys: Array<SensorMeasureMetaData>) {
    if (newMeasureKeys != null) {

      const newMeasureTypesByLocationMap = new Map<string, Array<SensorMeasureMetaData>>();
      newMeasureKeys.forEach(measureKey => {
        if (newMeasureTypesByLocationMap.has(measureKey.location)) {
          newMeasureTypesByLocationMap.get(measureKey.location).push(measureKey);
        } else {
          newMeasureTypesByLocationMap.set(measureKey.location, [measureKey]);
        }
      });

      this.locationsMeasures.reset();
      newMeasureTypesByLocationMap.forEach(
        (measureTypes: SensorMeasureMetaData[], location: string, map: Map<string, SensorMeasureMetaData[]>) => {

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
  }

  onSubmit() {
    if (!this.form.valid) {
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
