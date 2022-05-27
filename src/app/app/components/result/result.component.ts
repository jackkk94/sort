import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { IResult } from 'src/app/node/utils';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResultComponent implements OnInit {

  @Input() model: IResult[] = [];
  constructor() { }

  ngOnInit(): void {
    console.log(this.model)
  }
}
