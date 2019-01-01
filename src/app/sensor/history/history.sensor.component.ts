import {Component, OnInit, ViewChild} from '@angular/core';
import { NgbAccordion } from '@ng-bootstrap/ng-bootstrap';
import {Observable} from 'rxjs';
import {SensorService} from './../sensor.service';
import {SensorMeasureMetaData} from './../sensor.classes';
import {DebugDisplayHistoryComponent} from './debug-display/debug-display.history.component';
import { SensorHistorySelection } from '../selector/sensor-history-selector-form.service';

@Component({
  selector: 'app-sensor-history',
  templateUrl: './history.sensor.component.html'
})
export class HistorySensorComponent {
  sensorHistorySelection: SensorHistorySelection;
  isSelectionCollapsed: Boolean;
  sensorSelectionText: String = '';
  displayData: Boolean;

  // @ViewChild(NgbAccordion) accordion: NgbAccordion;

  constructor() {
    this.isSelectionCollapsed = false;
    this.displayData = false;
    this.sensorSelectionText = 'Select data';
    this.sensorHistorySelection = null;
  }

  toggleSensorSelection() {
    this.isSelectionCollapsed = !this.isSelectionCollapsed;
    this.displayData = this.isSelectionCollapsed && this.sensorHistorySelection != null;
  }

  onSensorHistorySelection(newSensorHistorySelection: SensorHistorySelection) {
    this.sensorHistorySelection = newSensorHistorySelection;
    // console.log('Selected measure keys: ' + JSON.stringify(newSensorHistorySelection));
    this.isSelectionCollapsed = true;
    this.displayData = true;
    this.sensorSelectionText = 'Change data selection';
  }
}
