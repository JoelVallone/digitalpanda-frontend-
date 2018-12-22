import {Component, OnInit, ViewChild} from '@angular/core';
import { NgbAccordion } from '@ng-bootstrap/ng-bootstrap';
import {Observable} from 'rxjs';
import {SensorService} from './../sensor.service';
import {SensorMeasureMetaData} from './../sensor.classes';
import {DebugDisplayHistoryComponent} from './debug-display/debug-display.history.component';

@Component({
  selector: 'app-sensor-history',
  templateUrl: './history.sensor.component.html'
})
export class HistorySensorComponent  implements OnInit {

  measureKeys: Observable<Array<SensorMeasureMetaData>>;

  @ViewChild(NgbAccordion) accordion: NgbAccordion;

  constructor(public sensorService: SensorService) {
  }

  ngOnInit() {
      this.measureKeys = this.sensorService.loadMeasurekeys();
      console.log(this.accordion);
  }


  onMeasureKeysSelected(selectedMeasureKeys: Array<SensorMeasureMetaData>) {
    // TODO: Further handle selection measure selection
    this.accordion.expand('history-debug');
    console.log('Selected measure keys: ' + JSON.stringify(selectedMeasureKeys));
  }
}
