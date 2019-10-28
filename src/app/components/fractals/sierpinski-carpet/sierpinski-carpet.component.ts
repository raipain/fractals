import { Component, OnInit } from '@angular/core';
import * as p5 from 'p5';

var detail = 1;

@Component({
  selector: 'app-sierpinski-carpet',
  templateUrl: './sierpinski-carpet.component.html',
  styleUrls: ['./sierpinski-carpet.component.scss']
})
export class SierpinskiCarpetComponent implements OnInit {

  private p5;

  constructor() { }

  ngOnInit() {
    this.createCanvas();
  }
  
  createCanvas() {
    this.p5 = new p5(this.sketch);
  }
  
  private sketch(p: any) {
       
    p.setup = () => {
      let canvas = p.createCanvas(200, 200);
      canvas.parent('sierp-carpet');
      p.rectMode(p.CENTER);
      p.fill(255);
      p.noStroke();
      p.translate(p.smallDim() / 2, p.smallDim() / 2);
      p.background(0);
      p.squares(0, 0, p.smallDim() / 3, p.smallDim() / 3, 200 / 3, 1);
      p.frameRate(0.8);
    };
  
    p.draw = () => {
      detail++;
      if (detail > 6) {
        detail = 1;
      }
      p.setup();
    };

    p.squares = (x, y, w, h, td, it) => {
      p.rect(x, y, w, h);
      if (it < detail) {
        var dnom = 3;
        var tnom = 3;
        p.squares(x - td, y, w / dnom, h / dnom, td / tnom, it + 1);
        p.squares(x - td, y - td, w / dnom, h / dnom, td / tnom, it + 1);
        p.squares(x - td, y + td, w / dnom, h / dnom, td / tnom, it + 1);
        p.squares(x + td, y, w / dnom, h / dnom, td / tnom, it + 1);
        p.squares(x + td, y - td, w / dnom, h / dnom, td / tnom, it + 1);
        p.squares(x + td, y + td, w / dnom, h / dnom, td / tnom, it + 1);
        p.squares(x, y + td, w / dnom, h / dnom, td / tnom, it + 1);
        p.squares(x, y - td, w / dnom, h / dnom, td / tnom, it + 1);
      }
    }

    p.smallDim = () => {
      return 200;
    };
  }

}
