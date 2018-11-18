import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SensorMeasureMetaData, SensorMeasure, SensorMeasureType, SensorMeasureTypeDetails } from './sensor.classes';
import { SensorService } from './sensor.service';

@Component({
  selector: 'app-sensor',
  templateUrl: './sensor.component.html'
})
export class SensorComponent implements OnInit, OnDestroy {

  @Input() public title: string;
  @Input() public sensor: SensorMeasureMetaData;

  public measureLoaded: boolean;
  public measure: SensorMeasure;
  public measureTypeDetails: SensorMeasureTypeDetails;
  private periodicServiceCall: any;

  constructor(public sensorService: SensorService) {
    this.measureLoaded = false;
  }

  ngOnInit() {
    this.loadAndSetMeasureCallback(this);
    this.periodicServiceCall = setInterval((that) => {this.loadAndSetMeasureCallback(this); }, 1000);
  }

  ngOnDestroy() {
      clearInterval(this.periodicServiceCall);
  }

  private loadAndSetMeasureCallback(that) {
    that.sensorService.loadLatestMeasure(that.sensor)
      .subscribe((measure) => {
        that.measure = measure;
        that.measureTypeDetails = SensorMeasureMetaData.getTypeDetail(that.sensor.type);
        that.measureLoaded = true;
      });
  }
}
