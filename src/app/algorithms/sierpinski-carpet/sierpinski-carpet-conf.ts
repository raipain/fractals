import * as p5 from 'p5';
import { Fractal } from '../fractal';
import { AnimationStateManagerService } from 'src/app/services/animation-state-manager.service';

export class SierpinskiCarpetConfigurable extends Fractal  {

  private detail: number;
  private maxDetail: number;
  private rectSize: number;

  constructor(animationStateManagerService: AnimationStateManagerService) {
    super(animationStateManagerService);
    this.detail = 0;
    this.maxDetail = 6;
    this.rectSize = 300;
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
      p.frameRate(this.frameRate);
      p.translate(this.width / 2, this.height / 2);
      p.squares(0, 0, this.rectSize / 3, this.rectSize / 3, this.rectSize / 3, 1);
    };
  
    p.draw = () => {
      this.setConfigurables(p);
      
      if(this.play) {
        this.detail++;
        if (this.detail > this.maxDetail) {
          this.detail = 1;
        }
        p.setup();
      }
    };

    p.squares = (x, y, w, h, td, it) => {
      p.rect(x, y, w, h);
      if (it < this.detail) {
        let dnom = 3;
        let tnom = 3;
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
  }

  setConfigurables(p: any) {
    p.frameRate(this.frameRate);
    p.fill(this.color);
  }

  setStop() {
    super.setStop();
    this.detail = 0;
  }

  
}
