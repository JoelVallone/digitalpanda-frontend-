import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-line-multi-chart',
  templateUrl: './line-multi-chart.component.html',
  styleUrls: ['./line-multi-chart.component.scss']
})
export class LineMultiChartComponent implements OnInit {

  dataTemperature: any = [
      {
        name: 'panda-home',
        series: [
          {
            name:  new Date('2018-12-25T00:11:00.000Z'),
            value: 36
          },
          {
            name:  new Date('2018-12-25T00:10:00.000Z'),
            value: 35
          }
        ]
      },
      {
      name: 'panda-home',
      series: [
        {
          name: new Date('2018-12-25T00:00:04.100Z'),
          value: 20
        },
        {
          name: new Date('2018-12-25T00:00:03.000Z'),
          value: 21
        },
        {
          name: new Date('2018-12-25T00:00:02.342Z'),
          value: 21
        },
        {
          name: new Date('2018-12-25T00:00:00.999Z'),
          value: 20
        },
        {
          name: new Date('2018-12-25T00:00:00.000Z'),
          value: 21
        },
        {
          name: new Date('2018-12-24T23:59:59.000Z'),
          value: 20
        }
      ]
    },
  ​
    {
      name: 'panda-outdoor',
      series: [
        {
          name: new Date('2018-12-25T00:00:00.500Z'),
          value: 2
        },
        {
          name: new Date('2018-12-24T23:59:59.000Z'),
          value: 1
        }
      ]
    }
  ];


  dataPressure: any = [
    {
      name: 'panda-home',
      series: [
        /*
        {
          name:  new Date('2018-12-25T00:10:00.000Z'),
          value: 24
        },
        */
        {
          name: new Date('2018-12-25T00:00:04.100Z'),
          value: 700
        },
        {
          name: new Date('2018-12-25T00:00:03.000Z'),
          value: 710
        },
        {
          name: new Date('2018-12-25T00:00:02.342Z'),
          value: 720
        },
        {
          name: new Date('2018-12-25T00:00:00.999Z'),
          value: 730
        }
      ]
    },
  ​
    {
      name: 'panda-outdoor',
      series: [
        {
          name: new Date('2018-12-25T00:00:03.500Z'),
          value: 710
        },
        {
          name: new Date('2018-12-25T00:00:03.500Z'),
          value: 710
        },
        {
          name: new Date('2018-12-25T00:00:00.500Z'),
          value: 720
        }
      ]
    }
  ];

  view: any[] = [700, 400];

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Number';
  showYAxisLabel = true;
  timeline = true;
  autoScale = true;

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
};

  constructor() { }

  ngOnInit() {
  }

}
