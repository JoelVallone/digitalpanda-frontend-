import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {SensorService} from './../sensor.service';
import {SensorMeasureMetaData} from './../sensor.classes';
import {DebugDisplayHistoryComponent} from './debug-display/debug-display.history.component';

@Component({
  selector: 'app-sensor-history',
  templateUrl: './history.sensor.component.html'
})
export class HistorySensorComponent {
}
