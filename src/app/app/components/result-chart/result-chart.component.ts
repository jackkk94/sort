import { Component, Input, OnInit } from '@angular/core';
import { ChartDataSets } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { IResult } from 'src/app/node/utils';

@Component({
  selector: 'app-result-chart',
  templateUrl: './result-chart.component.html',
  styleUrls: ['./result-chart.component.css']
})
export class ResultChartComponent implements OnInit {
  @Input() model: IResult[] = [];
  chart: ChartDataSets[];
  labels: Label[] = [];
  constructor() { }

  ngOnInit(): void {
    this.initChart();
  }

  initChart(): void {
    const data1 = this.model.map(e => e.value.operation1.averageTime);
    const data2 = this.model.map(e => e.value.operation2.averageTime);
    const NlogN = this.model.map(e => e.index*Math.log2(e.index)*data2[0]);
    const n = this.model.map(e => e.index*data2[0]);
    this.chart = [{ data: data1, fill: false, label: this.model[0].value.operation1.name }, { data: data2, fill: false, label: this.model[0].value.operation2.name }]
    this.labels = this.model.map(e => e.index.toString());

  }
}
