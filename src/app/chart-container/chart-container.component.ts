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
  private chartTypes: string[];
  private subscription: Subscription;

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.subscription = this.dataService.dataObservable.subscribe(dataGenerated => {
      this.dataLoaded = dataGenerated;

      if(dataGenerated) {

      }
    });
  }
}
