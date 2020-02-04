import * as p5 from 'p5';

var detail = 1;
var width;
var height;
var padding;
var parentId;

export class SierpinskiCarpetConf  {

  private p5;

  constructor() { }

  init(pId, h, w, p) {
    parentId = pId;
    height = h;
    width = w;
    this.createCanvas();
  }

  removeCanvas() {
    this.p5.remove();
  }
  
  createCanvas() {
    this.p5 = new p5(this.sketch);
  }
  
  private sketch(p: any) {
       
    p.setup = () => {
      let canvas = p.createCanvas(width, height);
      canvas.parent(parentId);
      p.rectMode(p.CENTER);
      p.fill(0);
      p.noStroke();
      p.translate(p.smallDim() / 2, p.smallDim() / 2);
      p.squares(0, 0, p.smallDim() / 3, p.smallDim() / 3, 150 / 3, 1);
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
      return 150;
    };
  }

}
