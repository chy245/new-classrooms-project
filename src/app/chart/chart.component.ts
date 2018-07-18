import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit {

  @Input() chartType: string;
  @Input() data: number[];
  @Input() datasets: any[];
  @Input() labels: string[];
  @Input() legend: boolean;
  @Input() options: any[];

  constructor() { }

  ngOnInit() {
  }

}
