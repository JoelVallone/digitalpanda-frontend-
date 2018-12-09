
/* These are JavaScript import statements. Angular doesn’t know anything about these. */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {SingleValueDisplayLatestComponent} from './live/single-value-display/single-value-display.latest.component';
import {DebugDisplayHistoryComponent} from './history/debug-display/debug-display.history.component';
import {LiveSensorComponent} from './live/live.sensor.component';
import {HistorySensorComponent} from './history/history.sensor.component';
import {SensorService} from './sensor.service';

@NgModule({
  imports: [
    CommonModule  /* These are NgModule imports used by Angular. */
  ],
  providers: [
    SensorService
  ],
  declarations: [
    SingleValueDisplayLatestComponent, DebugDisplayHistoryComponent, LiveSensorComponent, HistorySensorComponent
  ],
  exports: [
    LiveSensorComponent, HistorySensorComponent
  ]
})
export class SensorModule { }
