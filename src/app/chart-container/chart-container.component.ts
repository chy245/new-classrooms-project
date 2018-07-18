import { Component, Input, OnInit } from '@angular/core';
import { DataService } from "../data.service";
import {Subscription} from "rxjs/internal/Subscription";

@Component({
  selector: 'app-chart-container',
  templateUrl: './chart-container.component.html',
  styleUrls: ['./chart-container.component.css']
})
export class ChartContainerComponent implements OnInit {

  @Input() dataLoaded: boolean;
  private subscription: Subscription;
  chartTitles: string[] = ['Percentage female versus male', 'Percentage of first names that start with A-M versus N-Z',
    'Percentage of last names that start with A-M versus N-Z', 'Percentage of people in the top 10 most populous states',
    'Percentage of females in the top 10 most populous states', 'Percentage of males in the top 10 most populous states',
    'Age ranges'];
  chartTypes: string[] = ['doughnut', 'doughnut', 'doughnut', 'doughnut', 'doughnut', 'doughnut', 'doughnut'];
  data: any[];
  labels: any[];
  options: any[];

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.subscription = this.dataService.dataObservable.subscribe(dataGenerated => {
      if(dataGenerated) {
        this.data = this.dataService.data;
        this.labels = this.dataService.labels;
        this.options = this.dataService.options;
      }

      this.dataLoaded = dataGenerated;
    });
  }

  reset() {
    location.reload();
  }
}
