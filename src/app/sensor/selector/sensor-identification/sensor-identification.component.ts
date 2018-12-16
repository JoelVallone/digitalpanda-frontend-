import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';

import { SensorMeasureMetaData, SensorMeasureTypeDetails, SensorMeasureType } from './../../sensor.classes';

@Component({
  selector: 'app-sensor-identification',
  templateUrl: './sensor-identification.component.html',
  styleUrls: ['./sensor-identification.component.scss']
})
export class SensorIdentificationComponent implements OnInit, OnChanges {

  @Input() measureKeys: Array<SensorMeasureMetaData>;

  _measureTypesByLocation: Map<string, Array<SensorMeasureTypeDetails>>;
  _formModel;

  constructor() { }

  ngOnInit() {
    this._measureTypesByLocation = new Map();
    this._formModel = { sensorMeasureIds : {}};
  }


  ngOnChanges(changes: SimpleChanges): void {
    this.updateSelectableKeys(changes.measureKeys.currentValue);
  }

  private updateSelectableKeys(newMeasureKeys: Array<SensorMeasureMetaData>) {
    if (newMeasureKeys != null) {

      const newMeasureTypesByLocation = new Map<string, Array<SensorMeasureTypeDetails>>();
      const newFormModel = { sensorMeasureIds : {}};

      newMeasureKeys.forEach(measureKey => {
        const typeDetail: SensorMeasureTypeDetails = SensorMeasureMetaData.getTypeDetail(measureKey.type);
        if (newMeasureTypesByLocation.has(measureKey.location)) {
          newMeasureTypesByLocation.get(measureKey.location).push(typeDetail);
        } else {
          newMeasureTypesByLocation.set(measureKey.location, [typeDetail]);
        }
        newFormModel.sensorMeasureIds[this.getSensorKeyFormId(measureKey)] = false;
      });
      this._measureTypesByLocation = newMeasureTypesByLocation;
      this._formModel = newFormModel;
    }
  }

  private getSensorKeyFormId(measureKey: SensorMeasureMetaData): string {
    return measureKey.location + measureKey.type + '';
  }
}
