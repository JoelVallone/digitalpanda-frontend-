import {Component, OnInit} from '@angular/core';
import { SensorService } from './../../sensor.service';
import { SensorMeasuresHistoryDto, SensorMeasureMetaData, SensorMeasureType,
          SensorMeasureTypeDetails, SensorMeasureMean} from './../../sensor.classes';

@Component({
  selector: 'app-debug-display-history',
  templateUrl: './debug-display.history.component.html',
  styleUrls: ['./debug-display.history.component.scss']
})
export class DebugDisplayHistoryComponent implements OnInit {

  public measureLoaded: boolean;
  public sensor: SensorMeasureMetaData;
  public measureTypeDetails: SensorMeasureTypeDetails;
  public startTimeMillisIncl: number;
  public endTimeMillisExcl: number;
  public dataPointCount: number;

  public measuresIntervals: Array<Array<SensorMeasureMean>>;

  constructor(public sensorService: SensorService) {
    this.measureLoaded = false;
  }

  ngOnInit(): void {
    this.sensor = new SensorMeasureMetaData('panda-home', SensorMeasureType.TEMPERATURE);

    this.measureTypeDetails = SensorMeasureMetaData.getTypeDetail(this.sensor.type);
    this.startTimeMillisIncl = 1545695940000;
    this.endTimeMillisExcl =   1545696600000;
    this.dataPointCount = 500;

    this.loadAndSetMeasureCallback(this);
  }

  loadAndSetMeasureCallback(that: DebugDisplayHistoryComponent): void {
    that.sensorService.loadHistoryMeasures(that.sensor, that.startTimeMillisIncl, that.endTimeMillisExcl, that.dataPointCount)
    .subscribe((measuresIntervalsDto) => {
      that.measuresIntervals = new Array(measuresIntervalsDto.length);
      for (let i = 0; i < measuresIntervalsDto.length; i++) {
        const intervalDto =  measuresIntervalsDto[i];
        const measureInterval: Array<SensorMeasureMean> = new Array(intervalDto.values.length);
        const period = intervalDto.timeMillisBetweenDataPoints;
        const itervalStart = intervalDto.startTimeMillisIncl;
        measureInterval[0] = new SensorMeasureMean(intervalDto.values[0], itervalStart + (period / 2), itervalStart, itervalStart + period);
        for (let j = 1; j < intervalDto.values.length; j++) {
          measureInterval[j] = new SensorMeasureMean(
            intervalDto.values[j],
            itervalStart + (j + 0.5) * period,
            itervalStart + j * period,
            itervalStart + (j + 1.0) * period);
          }
        that.measuresIntervals[i] = measureInterval;
      }
      that.measureLoaded = true;
    });
  }
}
