import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';


import {RouterModule} from '@angular/router';
import {GreetingService} from './home/greeting.service';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {AboutComponent} from './about/about.component';
import {HomeComponent} from './home/home.component';
import {MonitoringComponent} from './monitoring/monitoring.component';
import {SensorComponent} from './monitoring/sensor/sensor.component';
import {SensorService} from './monitoring/sensor/sensor.service';
import {LocationStrategy, HashLocationStrategy} from '@angular/common';

/*
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
*/

@NgModule({
  declarations: [AppComponent, AboutComponent, HomeComponent, MonitoringComponent, SensorComponent],
  imports     : [BrowserModule, FormsModule, HttpModule, AppRoutingModule],
  providers   : [SensorService, GreetingService, {provide: LocationStrategy, useClass: HashLocationStrategy}],
  bootstrap   : [AppComponent]
})
export class AppModule { }
