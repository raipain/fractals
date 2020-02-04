import * as p5 from 'p5';

var setup = true;
var loop = 0;
var parentId;
var height;
var width;
var padding;

export class SierpinskiTrianglePreview {
  private p5;

  constructor() { }

  init(pId: string, h: number, w: number, p: number) {
    parentId = pId;
    height = h;
    width = w;
    padding = p;
    this.createCanvas();
  }
  
  createCanvas() {
    this.p5 = new p5(this.sketch);
  }
  
  private sketch(p: any) {
    let points: {x: number, y: number}[] = [
      { "x": width/2, "y": padding },
      { "x": padding, "y": height-padding },
      { "x": width-padding, "y": height-padding}
    ];
    let startingPoint: {x: number, y: number};
    
    p.setup = () => {
      let canvas = p.createCanvas(height, width);
      canvas.parent(parentId);
      p.stroke(0);
      p.strokeWeight(3);
    };
  
    p.draw = () => {
      if(setup) {
        p.point(points[0].x, points[0].y);
        p.point(points[1].x, points[1].y);
        p.point(points[2].x, points[2].y);
        startingPoint = { "x": width/2, "y": height/2 };
        setup = false;
      }
      
      loop++;
      let rand = p.floor(p.random(3));
      let x = p.lerp(points[rand].x, startingPoint.x, 0.5);
      let y = p.lerp(points[rand].y, startingPoint.y, 0.5);
      p.point(x, y);    
      startingPoint = {"x": x, "y": y};

      if(loop > 1000) {
        p.clear();
        setup = true;
        loop = 0;
      }
    }
  };
}
