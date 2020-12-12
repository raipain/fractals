import * as p5 from 'p5';

export class Point {
    public point: p5.Vector;
    public color: any;
  
    constructor(point: p5.Vector) {
      this.point = point;
    }

    setColor(color: any) {
      this.color = color;
    }
  
    draw(p: any) {
      p.stroke(this.color);
      p.point(this.point.x, this.point.y);
    }
  }