import {Component, OnInit, ViewChild} from '@angular/core';
import { NgbAccordion } from '@ng-bootstrap/ng-bootstrap';
import {Observable} from 'rxjs';
import {SensorService} from './../sensor.service';
import {SensorMeasureMetaData} from './../sensor.classes';
import {DebugDisplayHistoryComponent} from './debug-display/debug-display.history.component';
import { SensorHistorySelectorFormService } from '../selector/sensor-history-selector-form.service';

@Component({
  selector: 'app-sensor-history',
  templateUrl: './history.sensor.component.html'
})
export class HistorySensorComponent {

  isSelectionCollapsed: Boolean;
  sensorSelectionText: String = '';
  displayData: Boolean;

  // @ViewChild(NgbAccordion) accordion: NgbAccordion;

  constructor(public formService: SensorHistorySelectorFormService) {

    // TODO: Persist selection into a service
    this.isSelectionCollapsed = false;
    this.displayData = false;
    this.sensorSelectionText = 'Select sensors';
  }

  toggleSensorSelection() {
    this.isSelectionCollapsed = !this.isSelectionCollapsed;
    this.displayData = this.isSelectionCollapsed;
  }

  onMeasureKeysSelected(selectedMeasureKeys: Array<SensorMeasureMetaData>) {
    // TODO: Subscribe to form selection in formService and Further handle measure selection
    this.isSelectionCollapsed = true;
    this.displayData = true;
    this.sensorSelectionText = 'Change sensor selection';
    console.log('Selected measure keys: ' + JSON.stringify(selectedMeasureKeys));
  }
}
