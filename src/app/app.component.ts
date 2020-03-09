import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit{
  title: string = 'fractals';
  home: boolean = true;

  ngOnInit() {
    if(localStorage.getItem("home") != null) {
      if(localStorage.getItem("home") == "true") {
        this.home = true;
      }
      else {
        this.home = false;
      }
    }
  }

  homepage() {
    this.home = true;
    localStorage.setItem("home", "true");
  }
  
  canvas() {
    this.home = false;
    localStorage.setItem("home", "false");
  }
}
