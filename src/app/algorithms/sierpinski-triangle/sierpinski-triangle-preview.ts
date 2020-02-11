import * as p5 from 'p5';

var width: number;
var height: number;
var canvasColor: string
var parentId: string;
var points;
var refPoint;
var iter: number;
var maxIter: number;

export class SierpinskiTrianglePreview {
  private p5;

  constructor() { }

  init(pId: string, w: number, h: number, cc: string, mI: number) {
    width = w;
    height = h;
    canvasColor = cc;
    parentId = pId;
    points = [];
    iter = 0;
    maxIter = mI;
    this.createCanvas();
  }
  
  createCanvas() {
    this.p5 = new p5(this.sketch);
  }
  
  private sketch(p: any) {    
    p.setup = () => {
      let canvas = p.createCanvas(width, height);
      canvas.parent(parentId);

      p.background(canvasColor);
      p.stroke(0);
      p.strokeWeight(3);
      p.frameRate(100);

      refPoint = p.createVector(width / 2, height / 2);

      points.push(p.createVector(width / 2, 5));
      points.push(p.createVector(5, height - 5));
      points.push(p.createVector(width - 5, height - 5));
    
      p.point(points[0].x, points[0].y);
      p.point(points[1].x, points[1].y);
      p.point(points[2].x, points[2].y);
      p.point(refPoint.x, refPoint.y);
    };
  
    p.draw = () => {
      if(iter < maxIter) {
        let rand = p.floor(p.random(3));
        let newPoint = p5.Vector.lerp(points[rand], refPoint, 0.5);
        p.point(newPoint.x, newPoint.y);   
        refPoint = newPoint;
        iter++;
      }
      else {
        points = [];
        iter = 0;
        p.setup();
      }
    }
  };
}