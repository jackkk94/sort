import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  constructor(private readonly cdr: ChangeDetectorRef) {
  
  }

  ngOnDestroy(): void {

  }



}
