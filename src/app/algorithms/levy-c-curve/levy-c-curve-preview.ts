import * as p5 from 'p5';

var parentId;
var height;
var width;
var length;
var lines: Line[] = [];
var iter = 0;

export class LevyCCurvePreview {
    private p5;

    constructor() { }

    init(pId, h, w) {
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
            p.background("#cbcbcb");
            length = width/3;
            lines.push(new Line(width/2-length/2, height/2, width/2+length/2, height/2));
            p.line(lines[0].x1, lines[0].y1, lines[0].x2, lines[0].y2);
            p.frameRate(1);
        }

        p.draw = () => {
            if(iter < 10) {
                p.background("#cbcbcb");
                let tempLines: Line[] = [];
                for(let i = 0; i < lines.length; i++) {
                    let length = calculateLength(lines[i].x1, lines[i].y1, lines[i].x2, lines[i].y2);
                    let lengthSz = Math.sqrt(length/2 * length);
        
                    let x1 = lines[i].x1 + ((lines[i].x2 - lines[i].x1) * Math.cos(-p.PI/4)) - ((lines[i].y2 - lines[i].y1) * Math.sin(-p.PI/4));
                    let y1 = lines[i].y1 + ((lines[i].x2 - lines[i].x1) * Math.sin(-p.PI/4)) + ((lines[i].y2 - lines[i].y1) * Math.cos(-p.PI/4));
                    
                    let x2 = lines[i].x2 + ((lines[i].x1 - lines[i].x2) * Math.cos(p.PI/4)) - ((lines[i].y1 - lines[i].y2) * Math.sin(p.PI/4));
                    let y2 = lines[i].y2 + ((lines[i].x1 - lines[i].x2) * Math.sin(p.PI/4)) + ((lines[i].y1 - lines[i].y2) * Math.cos(p.PI/4));
        
                    let lerpAmount = lengthSz/calculateLength(lines[i].x1, lines[i].y1, x1, y1);
                    let vect1 = p5.Vector.lerp(p.createVector(lines[i].x1, lines[i].y1), p.createVector(x1, y1), lerpAmount);
                    let vect2 = p5.Vector.lerp(p.createVector(lines[i].x2, lines[i].y2), p.createVector(x2, y2), lerpAmount);
        
                    p.line(lines[i].x1, lines[i].y1, vect1.x, vect1.y);
                    p.line(vect2.x, vect2.y, lines[i].x2, lines[i].y2);
        
                    tempLines.push(new Line(lines[i].x1, lines[i].y1, vect1.x, vect1.y));
                    tempLines.push(new Line(vect2.x, vect2.y, lines[i].x2, lines[i].y2));
                }
                lines = tempLines;
                iter++;
            }
            else {
                lines = [];
                iter = 0;
                p.setup();
            }
        }
    }
}

function calculateLength(x1, y1, x2, y2) {
    let lengthX = Math.abs(x1 - x2);
    let lengthY = Math.abs(y1 - y2);
    let length = Math.sqrt(lengthX*lengthX + lengthY*lengthY);

    return length;
}

class Line {
    x1: number; 
    x2: number; 
    y1: number; 
    y2: number;

    constructor(x1, y1, x2, y2) {
        this.x1 = x1;
        this.x2 = x2;
        this.y1 = y1;
        this.y2 = y2;
    }
}   
