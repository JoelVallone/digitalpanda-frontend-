import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

// https://github.com/angular/angular-cli/wiki/stories-include-bootstrap
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';


import {RouterModule} from '@angular/router';
import {GreetingService} from './home/greeting.service';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';

import {NavBarComponent} from './ui/navbar/navbar.component';
import {AboutComponent} from './about/about.component';
import {HomeComponent} from './home/home.component';
import {MonitoringComponent} from './monitoring/monitoring.component';
import {SensorLatestComponent} from './monitoring/sensor/latest/sensor.latest.component';
import {SensorHistoryComponent} from './monitoring/sensor/history/sensor.history.component';
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
  declarations: [AppComponent, NavBarComponent, AboutComponent, HomeComponent,
    MonitoringComponent, SensorLatestComponent, SensorHistoryComponent],
  imports     : [BrowserModule, FormsModule, HttpModule, AppRoutingModule, NgbModule],
  providers   : [SensorService, GreetingService, {provide: LocationStrategy, useClass: HashLocationStrategy}],
  bootstrap   : [AppComponent]
})
export class AppModule { }
