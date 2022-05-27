import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { ChartsModule } from 'ng2-charts';

import { AppComponent } from './app.component';
import { ArrayTestComponent } from './app/components/array-test/array-test.component';
import { LineChartComponent } from './app/components/line-chart/line-chart.component';
import { ResultComponent } from './app/components/result/result.component';
import { HttpClientModule } from '@angular/common/http';
import { ResultTableComponent } from './app/components/result-table/result-table.component';
import { ResultChartComponent } from './app/components/result-chart/result-chart.component';

@NgModule({
  declarations: [
    AppComponent,
    ArrayTestComponent,
    LineChartComponent,
    ResultComponent,
    ResultTableComponent,
    ResultChartComponent,
    
  ],
  imports: [
    BrowserModule,
    ChartsModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
