import { Component, OnInit } from '@angular/core';
import { GreetingService } from './greeting.service';
import { Observable} from 'rxjs';
import { Greeting } from './greeting.classes';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  callerName: string;
  greeting: Greeting;

  constructor(public greetingService: GreetingService) {
    this.callerName = 'frontend';
    this.greeting = new Greeting(0, 'nothing');
  }

  ngOnInit() {
    this.greetingService.getGreeting(this.callerName)
      .subscribe(greeting => {
        this.greeting = greeting;
      });
  }
}
