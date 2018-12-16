import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {SensorService} from './../sensor.service';
import {SensorMeasureMetaData} from './../sensor.classes';
import {SingleValueDisplayLatestComponent} from './single-value-display/single-value-display.latest.component';

@Component({
  selector: 'app-live-sensor',
  templateUrl: './live.sensor.component.html'
})
export class LiveSensorComponent implements OnInit {
  measureKeys: Observable<Array<SensorMeasureMetaData>>;

  constructor(public sensorService: SensorService) { }

  ngOnInit() {
      this.measureKeys = this.sensorService.loadMeasurekeys();
  }
}
