import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { iterationsCount, experiments, genSampleIndexes, IResult, IServerResult, runExperiment, calcTime, ArrayType, IData } from 'src/app/node/utils';



const jsonPath = 'assets/';

@Component({
  selector: 'app-array-test',
  templateUrl: './array-test.component.html',
  styleUrls: ['./array-test.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArrayTestComponent implements OnInit {
  iterationsCount = iterationsCount;
  serverResult: IServerResult[] = [];
  showServerResult = false;
  arraySize = 100;
  experimentsCount = experiments;
  maxExperimentsCount = 8000;
  numbers: number[] = [];
  data: IData;
  processing = false;
  result: IResult[] = [];
  arrType = ArrayType.random;

  sampleIndexes = [1, Math.ceil(this.arraySize / 2), this.arraySize - 1];

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {
    this.getJSON(`${jsonPath}data.json`).subscribe(data => {
      this.data = data;
    });
    this.getJSON(`${jsonPath}result.json`).subscribe(data => {
      this.serverResult = data;
      this.cdr.markForCheck();
    });
  }

  ngOnInit(): void {


  }


  async handleClick(): Promise<void> {
    if (this.processing) {
      return;
    }
    this.processing = true;
    this.sampleIndexes = genSampleIndexes(this.arraySize);
    await this.runExperiments(this.arrType);
    this.processing = false;
    this.cdr.markForCheck();
  }

  async runExperiments(type: ArrayType): Promise<void> {
    this.result = [];
    let array: number[];
    switch (type) {
      case ArrayType.initial: array = this.data.initial; break;
      case ArrayType.random: array = this.data.random; break;
      case ArrayType.reversed: array = this.data.reversed; break;
      default: array = this.data.random;
    }

    for (let i of this.sampleIndexes) {
      const result = await runExperiment(i, array.slice(0, i), this.experimentsCount, calcTime);
      this.result.push(result)
    }
  }

  onDataTypeChange(type: ArrayType): void {
    this.arrType = type;
  }

  onExperimentsChange(e: Event): void {
    const count = +(e.target as HTMLInputElement).value;
    if (count > this.maxExperimentsCount) {
      this.experimentsCount = this.maxExperimentsCount;
      return;
    }


    this.experimentsCount = count;
  }

  public getJSON(url: string): Observable<any> {
    return this.http.get(url);
  }
}