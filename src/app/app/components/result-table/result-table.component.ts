import { Component, Input, OnInit } from '@angular/core';
import { IResult } from 'src/app/node/utils';

@Component({
  selector: 'app-result-table',
  templateUrl: './result-table.component.html',
  styleUrls: ['./result-table.component.css']
})
export class ResultTableComponent implements OnInit {
  @Input() model: IResult[] = [];
  @Input() caption: string;
  operationNames: { op1: string, op2: string };
  constructor() { }

  ngOnInit(): void {
    this.operationNames = {
      op1: this.model[0].value.operation1.name,
      op2: this.model[0].value.operation2.name,
    }

    this.model.forEach(e => {
      e.value.operation1.isFaster > e.value.operation2.isFaster ?
        e.value.operation1.class = 'table-success'
        :
        e.value.operation2.class = 'table-success';

      return e;
    })
  }

}
