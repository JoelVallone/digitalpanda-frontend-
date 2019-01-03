import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

import {SensorService} from './../sensor.service';
import {SensorMeasureMetaData} from './../sensor.classes';
import {SingleValueDisplayLatestComponent} from './single-value-display/single-value-display.latest.component';

@Component({
  selector: 'app-live-sensor',
  templateUrl: './live.sensor.component.html'
})
export class LiveSensorComponent implements OnInit {
  measureKeys: Observable<Array<SensorMeasureMetaData>>;
  measureKeysByLocation: Observable<Map<string, Array<SensorMeasureMetaData>>>;

  constructor(public sensorService: SensorService) { }

  ngOnInit() {
    this.measureKeys = this.sensorService.loadMeasurekeys();
      this.measureKeysByLocation = this.measureKeys
        .pipe(map( (measureKeys: Array<SensorMeasureMetaData>) => {
          const latestMeasureKeysByLocation = new Map<string, Array<SensorMeasureMetaData>>();
          measureKeys.forEach((measureKey) => this.putByLocation(latestMeasureKeysByLocation,  measureKey));
          return latestMeasureKeysByLocation;
        }));
  }

  private putByLocation(mapRef: Map<string, Array<SensorMeasureMetaData>>, measureKey: SensorMeasureMetaData): void {
      mapRef.has(measureKey.location) ? mapRef.get(measureKey.location).push(measureKey) : mapRef.set(measureKey.location, [measureKey]);
  }
}
