import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {SensorService} from './sensor/sensor.service';
import {SensorMeasureMetaData} from './sensor/sensor.classes';
import {SensorLatestComponent} from './sensor/latest/sensor.latest.component';

@Component({
  selector: 'app-monitoring',
  templateUrl: './monitoring.component.html'
})
export class MonitoringComponent implements OnInit {
  measureKeys: Observable<Array<SensorMeasureMetaData>>;
  childeTitle: string;

  constructor(public sensorService: SensorService) { }

  ngOnInit() {
      this.measureKeys = this.sensorService.loadMeasurekeys();
      this.childeTitle = 'blop';
  }
}
