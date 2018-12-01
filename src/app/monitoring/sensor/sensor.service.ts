import { Injectable } from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';
import { map } from 'rxjs/operators';
import {Observable} from 'rxjs';
import {SensorMeasure} from './sensor.classes';
import {SensorMeasureMetaData} from './sensor.classes';
import { environment } from './../../../environments/environment';

@Injectable()
export class SensorService {
  public static baseUrl: string  =  environment.APIEndpoint + `/ui/sensor`;

  constructor(private http: Http) {}

  loadLatestMeasure(measureKey: SensorMeasureMetaData): Observable<SensorMeasure> {
    const params = new URLSearchParams();
    params.set('type', JSON.stringify(measureKey.type).replace(/\"/g, ''));
    params.set('location', measureKey.location);
    return this.http.get(SensorService.baseUrl, {search: params})
      .pipe(map((res) => res.json() as SensorMeasure));
  }

  loadMeasurekeys(): Observable<Array<SensorMeasureMetaData>> {
    const url: string = SensorService.baseUrl + `/keys`;
    return this.http.get(url)
    .pipe(map((res) => res.json() as Array<SensorMeasureMetaData>));
  }
}
