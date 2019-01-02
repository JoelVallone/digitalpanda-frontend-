import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

// https://github.com/angular/angular-cli/wiki/stories-include-bootstrap
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';


import {RouterModule} from '@angular/router';
import {GreetingService} from './home/greeting.service';
import {HttpModule} from '@angular/http';

import {NavBarComponent} from './ui/navbar/navbar.component';
import {HomeComponent} from './home/home.component';
import {SensorModule} from './sensor/sensor.module';
import {LocationStrategy, HashLocationStrategy} from '@angular/common';

@NgModule({
  declarations: [AppComponent, NavBarComponent, HomeComponent],
  imports     : [BrowserModule, FormsModule, HttpModule, AppRoutingModule, NgbModule, SensorModule],
  providers   : [GreetingService, {provide: LocationStrategy, useClass: HashLocationStrategy}],
  bootstrap   : [AppComponent]
})
export class AppModule { }
