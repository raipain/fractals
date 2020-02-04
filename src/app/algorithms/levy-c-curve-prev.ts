import * as p5 from 'p5';

var width;
var height;
var padding;
var parentId;
var rotation = 4;
var iteration = 1;
var lines: {x: number, y: number, length: number}[];

var length = 25;

export class LevyCCurvePreview  {

  private p5;

  constructor() {
      lines = new Array<{x: number, y: number, length: number}>();
  }

  init(pId, h, w, p) {
    parentId = pId;
    height = h;
    width = w;
    this.createCanvas();
  }
  
  createCanvas() {
    this.p5 = new p5(this.sketch);
  }
  
  private sketch(p: any) {
       
    p.setup = () => {
      let canvas = p.createCanvas(width, height);
      canvas.parent(parentId);
      p.stroke(0);
      let x = (width/2)-(length/2);
      let y = height/2; 
      p.line(x, y, x + length, y);
      lines.push({x: x, y: y, length: length});
    };
  
    p.draw = () => {
        rotation = rotation / iteration;
        for(let i = 0; i<lines.length; i++) {
            p.translate(lines[i].x, lines[i].y);
            p.rotate(-p.PI/4);
            p.line(0, 0, length, 0);
            lines.push({x: lines[i].x, y: lines[i].y, length: length});
            p.translate(length, 0);
            p.rotate(p.PI/2);
            p.line(0, 0, length, 0);
            lines.push({x: lines[i].x + length, y: lines[i].y, length: length});
        }
        iteration++;
    };
  }

}
