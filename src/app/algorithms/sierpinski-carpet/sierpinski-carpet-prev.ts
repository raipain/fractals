import * as p5 from 'p5';
import { Fractal } from '../fractal';

export class SierpinskiCarpetPreview extends Fractal {
  private detail: number;

  constructor() {
    super();
    this.detail = 1;
  }

  init(parentId: string, width: number, height: number, canvasColor: string) {
    super.init(parentId, width, height, canvasColor);
    this.createCanvas();
  }
  
  sketch(p: any) {     
    p.setup = () => {
      this.canvas = p.createCanvas(this.width, this.height);
      this.canvas.parent(this.parentId);
      
      p.rectMode(p.CENTER);
      p.fill(this.color);
      p.noStroke();
      p.translate(p.smallDim() / 2, p.smallDim() / 2);
      p.squares(0, 0, p.smallDim() / 3, p.smallDim() / 3, this.width / 3, 1);
      p.frameRate(0.8);
    };
  
    p.draw = () => {
      this.detail++;
      if (this.detail > 6) {
        this.detail = 1;
      }
      p.setup();
    };

    p.squares = (x, y, w, h, td, it) => {
      p.rect(x, y, w, h);
      if (it < this.detail) {
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
      return this.width;
    };
  }

}
