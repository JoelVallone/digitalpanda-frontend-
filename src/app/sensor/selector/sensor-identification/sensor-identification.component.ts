import { Component, Input, OnInit, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormArray, FormControl, FormBuilder } from '@angular/forms';

import { SensorMeasureMetaData, SensorMeasureTypeDetails, SensorMeasureType } from './../../sensor.classes';
import { map } from 'rxjs/operators';
import { SensorHistorySelectorFormService } from '../sensor-history-selector-form.service';

@Component({
  selector: 'app-sensor-identification',
  templateUrl: './sensor-identification.component.html',
  styleUrls: ['./sensor-identification.component.scss']
})
export class SensorIdentificationComponent {
  @Input() public sensorsIdentificationForm: FormGroup;

  constructor(public formService: SensorHistorySelectorFormService) {}

  public isMeasureTypesByLocationEmtpy(): Boolean {
    return this.formService.isMeasureTypesByLocationEmtpy();
  }

  public isMeasureTypesByLocationFull(): Boolean {
    return this.formService.isMeasureTypesByLocationFull();
  }

  public selectAllLocations(): void {
    return this.formService.selectAllLocations();
  }

  public clearAllLocations(): void {
    return this.formService.clearAllLocations();
  }


}
