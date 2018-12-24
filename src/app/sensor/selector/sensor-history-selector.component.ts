import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbAccordion } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { SensorService } from './../sensor.service';
import { SensorMeasureMetaData } from './../sensor.classes';
import { SensorHistorySelectorFormService } from './sensor-history-selector-form.service';
import { FormGroup, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sensor-history-selector',
  templateUrl: './sensor-history-selector.component.html',
  styleUrls: ['./sensor-history-selector.component.scss']
})
export class SensorHistorySelectorComponent {

  private measureTypesByLocationMap = new Map<string, Array<SensorMeasureMetaData>>();
  private _sensorForm: FormGroup;

  constructor(public formService: SensorHistorySelectorFormService) {}


  get sensorForm(): FormGroup {
    if (!this._sensorForm) {
      console.log('get form from formService.form');
      this._sensorForm = this.formService.form;
      this.formService.refreshFormData();
    }
    return this._sensorForm;
  }

  canSubmit(): Boolean {
    return this.formService.canSubmit();
  }

  onSubmit() {
    return this.formService.emitNewSubmission();
  }
}
