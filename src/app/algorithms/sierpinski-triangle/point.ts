import * as p5 from 'p5';

export class Point {
    public point: p5.Vector;
  
    constructor(point: p5.Vector) {
      this.point = point;
    }
  
    draw(p: any) {
      p.point(this.point.x, this.point.y);
    }
  }