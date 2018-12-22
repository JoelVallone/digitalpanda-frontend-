import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup, FormArray, FormControl, FormBuilder } from '@angular/forms';

import { SensorMeasureMetaData, SensorMeasureTypeDetails, SensorMeasureType } from './../../sensor.classes';

@Component({
  selector: 'app-sensor-identification',
  templateUrl: './sensor-identification.component.html',
  styleUrls: ['./sensor-identification.component.scss']
})
export class SensorIdentificationComponent implements OnInit, OnChanges {

  @Input() measureKeys: Array<SensorMeasureMetaData>;

  _measureTypesByLocation: Map<string, Array<SensorMeasureType>>;
  public form  = this.fb.group({
      locationsMeasures: this.fb.array([])
  });

  get locationsMeasures(): FormArray {
    return this.form.get('locationsMeasures') as FormArray;
  }

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this._measureTypesByLocation = new Map();
    // { sensorMeasureIds : {}};
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.updateSelectableKeys(changes.measureKeys.currentValue);
  }

  private updateSelectableKeys(newMeasureKeys: Array<SensorMeasureMetaData>) {
    if (newMeasureKeys != null) {

      const newMeasureTypesByLocationMap = new Map<string, Array<SensorMeasureType>>();

      newMeasureKeys.forEach(measureKey => {
        if (newMeasureTypesByLocationMap.has(measureKey.location)) {
          newMeasureTypesByLocationMap.get(measureKey.location).push(measureKey.type);
        } else {
          newMeasureTypesByLocationMap.set(measureKey.location, [measureKey.type]);
        }
      });
      this._measureTypesByLocation = newMeasureTypesByLocationMap;

      this.locationsMeasures.reset();
      newMeasureTypesByLocationMap.forEach(
        (measureTypes: SensorMeasureType[], location: string, map: Map<string, SensorMeasureType[]>) => {

          const locationMeasures: FormGroup =  this.fb.group({
            location,
            measures : this.fb.array([])
          });

          measureTypes.forEach((measureType) => {
            (locationMeasures.get('measures') as FormArray).push(
              this.fb.group({
                measureId : this.getSensorFormId(location, measureType),
                measureTypeName : SensorMeasureMetaData.getTypeDetail(measureType).toString(),
                selectionControl: this.fb.control(false)
              }));
          });

          this.locationsMeasures.push(locationMeasures);
      });
      console.log(this.form);
    }
  }

  onSubmit() {
    // TODO: Use EventEmitter with form value

    if (!this.form.valid) {
      console.error('Invalid form' + JSON.stringify(this.form.errors));
      return;
    }
      console.log(JSON.stringify(this.form.value));
  }

  private getSensorKeyFormId(measureKey: SensorMeasureMetaData): string {
    return this.getSensorFormId(measureKey.location, measureKey.type) ;
  }

  private getSensorFormId(location: String, type: SensorMeasureType): string {
    return location + '-' + type.toString();
  }
}
