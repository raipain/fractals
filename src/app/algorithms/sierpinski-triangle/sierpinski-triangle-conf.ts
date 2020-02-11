import * as p5 from 'p5';

var width: number;
var height: number;
var canvasColor: string
var parentId: string;
var points;
var refPoint;
var iter: number;
var maxIter: number;

var frameRate = 100;
var color = "#000";
var customColors: boolean = false;
var color1 = "#000";
var color2 = "#000";
var color3 = "#000";

export class SierpinskiTriangleConfigurable {
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
      p.stroke(color);
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
      setConfigurables(p);

      if(iter < maxIter) {
        let rand = p.floor(p.random(3));
        if(customColors && rand == 0) p.stroke(color1);
        else if(customColors && rand == 1) p.stroke(color2);
        else if(customColors && rand == 2) p.stroke(color3);
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

  setSpeed(speed: number) {
    frameRate = speed;
  }

  setCustomColors(value: boolean) {
    customColors = value
  }

  setColor(col: string) {
    color = col;
  }

  setColor1(col: string) {
    console.log(col)
    color1 = col;
  }

  setColor2(col: string) {
    color2 = col;
  }

  setColor3(col: string) {
    color3 = col;
  }

}

function setConfigurables(p: any) {
  p.frameRate(frameRate);
  p.stroke(color);
}