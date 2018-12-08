import {Component, OnInit} from '@angular/core';
import { SensorService } from './../sensor.service';
import { SensorMeasuresHistoryDto, SensorMeasureMetaData, SensorMeasureType,
          SensorMeasureTypeDetails, SensorMeasure} from './../sensor.classes';

@Component({
  selector: 'app-sensor-history',
  templateUrl: './sensor.history.component.html',
  styleUrls: ['./sensor.history.component.scss']
})
export class SensorHistoryComponent implements OnInit {

  public measureLoaded: boolean;
  public sensor: SensorMeasureMetaData;
  public measureTypeDetails: SensorMeasureTypeDetails;
  public startTimeMillisIncl: number;
  public endTimeMillisExcl: number;
  public dataPointCount: number;

  public measuresIntervals: Array<Array<SensorMeasure>>;

  constructor(public sensorService: SensorService) {
    this.measureLoaded = false;
  }

  ngOnInit(): void {
    this.sensor = new SensorMeasureMetaData('panda-home', SensorMeasureType.TEMPERATURE);
    this.startTimeMillisIncl = 1545695940000;
    this.endTimeMillisExcl =   1545696600000;
    this.dataPointCount = 500;
    console.log('SensorHistoryComponent ngOnInit');
    this.loadAndSetMeasureCallback(this);
  }

  loadAndSetMeasureCallback(that: SensorHistoryComponent): void {
    that.sensorService.loadHistoryMeasures(that.sensor, that.startTimeMillisIncl, that.endTimeMillisExcl, that.dataPointCount)
    .subscribe((measuresIntervalsDto) => {
      that.measuresIntervals = new Array(measuresIntervalsDto.length);
      for (let i = 0; i < measuresIntervalsDto.length; i++) {
        const measureInterval: Array<SensorMeasure> = new Array(measuresIntervalsDto[i].values.length);
        for (let j = 0; j < measuresIntervalsDto[i].values.length; j++) {
          measureInterval[j] = new SensorMeasure(
            measuresIntervalsDto[i].values[j],
            measuresIntervalsDto[i].startTimeMillisIncl + (j * measuresIntervalsDto[i].timeMillisBetweenDataPoints));
        }
        that.measuresIntervals[i] = measureInterval;
      }

      that.measureTypeDetails = SensorMeasureMetaData.getTypeDetail(that.sensor.type);
      that.measureLoaded = true;
    });
  }
}
