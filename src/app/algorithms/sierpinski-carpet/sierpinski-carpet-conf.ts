import * as p5 from 'p5';
import { ConfigurableFractal } from '../fractal-configurable';
import { AnimationStateManagerService } from 'src/app/services/animation-state-manager.service';

export class SierpinskiCarpetConfigurable extends ConfigurableFractal  {
  private detail: number;
  private maxDetail: number;
  private rectSize: number;

  constructor(animationStateManagerService: AnimationStateManagerService) {
    super(animationStateManagerService);
    this.detail = 0;
    this.maxDetail = 6;
  }

  init(parentId: string, width: number, height: number, canvasColor: string) {
    super.init(parentId, width, height, canvasColor);
    this.rectSize = Math.min(this.height / 3, this.width / 3);
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
      p.squares(0, 0, this.rectSize, this.rectSize, this.rectSize, 1);
    };
  
    p.draw = () => {
      this.setConfigurables(p);

      if(this.stop) {
        p.setup();
      }
      else if(this.play) {
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

  setRectSize(obj: any, rectSize: number): void {
    obj.rectSize = rectSize;
    obj.setStop();
  }
}

class Rectangle {
  public A: p5.Vector;
  public B: p5.Vector;
  public C: p5.Vector;
  public D: p5.Vector;

  constructor(A: p5.Vector, B: p5.Vector, C: p5.Vector, D: p5.Vector) {
    this.A = A;
    this.B = B;
    this.C = C;
    this.D = D;
  }

  draw(p: any): void {
    p.beginShape();
    p.vertex(this.A);
    p.vertex(this.B);
    p.vertex(this.D);
    p.vertex(this.C);
    p.vertex(this.A);
    p.endShape();
  }
}
