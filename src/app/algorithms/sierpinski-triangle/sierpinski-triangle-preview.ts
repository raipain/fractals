import * as p5 from 'p5';
import { Fractal } from '../fractal';
import { Point } from './point';

export class SierpinskiTrianglePreview extends Fractal {
  private roots: Point[];
  private refPoint: Point;

  constructor() {
    super();
  }

  init(parentId: string, width: number, height: number, canvasColor: string) {
    super.init(parentId, width, height, canvasColor);
    this.createCanvas();

    this.roots = [];
    this.roots.push(new Point(new p5.Vector(this.width / 2, 5)));
    this.roots.push(new Point(new p5.Vector(5, this.height - 5)));
    this.roots.push(new Point(new p5.Vector(this.width - 5, this.height - 5)));
    this.refPoint = (new Point(new p5.Vector(this.width / 2, this.height / 2)));
  }

  sketch(p: any) {    
    p.setup = () => {
      this.canvas = p.createCanvas(this.width, this.height);
      this.canvas.parent(this.parentId);

      p.background(this.canvasColor);
      p.stroke(0);
      p.strokeWeight(3);
      p.frameRate(100);

      p.point(this.roots[0].point.x, this.roots[0].point.y);
      p.point(this.roots[1].point.x, this.roots[1].point.y);
      p.point(this.roots[2].point.x, this.roots[2].point.y);
      p.point(this.refPoint.point.x, this.refPoint.point.y);
    };
  
    p.draw = () => {
      if(this.iter < 100) {
        let rand = p.floor(p.random(3));

        let newPoint = p5.Vector.lerp(this.roots[rand].point, this.refPoint.point, 0.5);
        p.point(newPoint.x, newPoint.y);
        this.refPoint = new Point(newPoint);
        this.iter++;
      }
      else {
        this.iter = 0;
        p.setup();
      }
    }
  };
}