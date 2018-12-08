import { Injectable } from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';
import { map } from 'rxjs/operators';
import {Observable} from 'rxjs';
import { SensorMeasureMetaData, SensorMeasureLatestDto, SensorMeasuresHistoryDto } from './sensor.classes';
import { environment } from './../../../environments/environment';

@Injectable()
export class SensorService {
  public static baseUrl: string  =  environment.APIEndpoint + `/ui/sensor`;

  constructor(private http: Http) {}

  loadHistoryMeasures(measureKey: SensorMeasureMetaData, startTimeMillisIncl: number,
                      endTimeMillisExcl: number, dataPointCount: number): Observable<Array<SensorMeasuresHistoryDto>> {
    const params = new URLSearchParams();
    params.set('type', JSON.stringify(measureKey.type).replace(/\"/g, ''));
    params.set('location', measureKey.location);
    params.set('startTimeMillisIncl', String(startTimeMillisIncl));
    params.set('endTimeMillisExcl', String(endTimeMillisExcl));
    params.set('dataPointCount', String(dataPointCount));
    return this.http.get(SensorService.baseUrl + `/history`, {search: params})
      .pipe(map((res) => res.json() as Array<SensorMeasuresHistoryDto>));
  }

  loadLatestMeasure(measureKey: SensorMeasureMetaData): Observable<SensorMeasureLatestDto> {
    const params = new URLSearchParams();
    params.set('type', JSON.stringify(measureKey.type).replace(/\"/g, ''));
    params.set('location', measureKey.location);
    return this.http.get(SensorService.baseUrl, {search: params})
      .pipe(map((res) => res.json() as SensorMeasureLatestDto));
  }

  loadMeasurekeys(): Observable<Array<SensorMeasureMetaData>> {
    const url: string = SensorService.baseUrl + `/keys`;
    return this.http.get(url)
    .pipe(map((res) => res.json() as Array<SensorMeasureMetaData>));
  }
}
