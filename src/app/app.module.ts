import { BrowserModule } from '@angular/platform-browser';
import { ChartsModule } from "ng2-charts";
import { FormsModule } from "@angular/forms";
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


import { AppComponent } from './app.component';
import { SubmitJsonComponent } from './submit-json/submit-json.component';
import { ChartContainerComponent } from './chart-container/chart-container.component';
import { ChartComponent } from './chart/chart.component';

@NgModule({
  declarations: [
    AppComponent,
    SubmitJsonComponent,
    ChartContainerComponent,
    ChartComponent,
  ],
  imports: [
    BrowserModule,
    ChartsModule,
    FormsModule,
    NgbModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
