import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {SensorService} from './sensor/sensor.service';
import {SensorMeasureMetaData} from './sensor/sensor.classes';
import {SensorComponent} from './sensor/sensor.component';

@Component({
  selector: 'app-monitoring',
  styleUrls: ['./monitoring.component.css'],
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
