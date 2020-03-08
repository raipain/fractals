import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  title: string = 'fractals';
  home: boolean = true;

  homepage() {
    this.home = true;
  }

  canvas() {
    this.home = false;
  }
}
