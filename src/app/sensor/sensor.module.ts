
/* These are JavaScript import statements. Angular doesn’t know anything about these. */
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import {SingleValueDisplayLatestComponent} from './live/single-value-display/single-value-display.latest.component';
import {DebugDisplayHistoryComponent} from './history/debug-display/debug-display.history.component';
import {LiveSensorComponent} from './live/live.sensor.component';
import {HistorySensorComponent} from './history/history.sensor.component';
import {SensorService} from './sensor.service';
import {SensorIdentificationComponent} from './selector/sensor-identification/sensor-identification.component';

@NgModule({
  imports: [
    CommonModule,  /* These are NgModule imports used by Angular. */
    FormsModule
  ],
  providers: [
    SensorService
  ],
  declarations: [
    SingleValueDisplayLatestComponent, DebugDisplayHistoryComponent, LiveSensorComponent, HistorySensorComponent,
    SensorIdentificationComponent
  ],
  exports: [
    LiveSensorComponent, HistorySensorComponent
  ]
})
export class SensorModule { }
