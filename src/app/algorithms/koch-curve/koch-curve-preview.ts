import * as p5 from 'p5';

var width;
var height;
var parentId;
var length;
var lines = [];
var iter = 0;

export class KochCurvePreview {
    private p5;

    constructor() { }

    init(pId, h, w) {
        parentId = pId;
        height = h;
        width = w;
        length = width;
        this.createCanvas();
    }

    createCanvas() {
        this.p5 = new p5(this.sketch);
    }

    private sketch(p: any) {
        p.setup = () => {
            let canvas = p.createCanvas(width, height);
            canvas.parent(parentId);
            p.frameRate(1);
            p.background("#cbcbcb");
            p.stroke(0);
            let root = new Line(p.createVector(width/2-length/2, height/2), 
                                p.createVector(width/2+length/2, height/2), length);
            lines.push(root);
            p.line(root.a.x, root.a.y, root.b.x, root.b.y);
        }
        
        p.draw = () => {
            if(iter < 7) {
                p.background("#cbcbcb");
                let newLines = [];
                for(let i = 0; i < lines.length; i++) {
                    let temp = lines[i].expand(p);
                    for(let j = 0; j < temp.length; j++) {
                        newLines.push(temp[j]);
                    }
                }
                lines = newLines;
                iter++;
            }
            else {
                iter = 0;
                lines = [];
                p.setup();
            }
        }
    }    
}


class Line {
    a;
    b;
    length;

    constructor(a, b, length) {
        this.a = a;
        this.b = b;
        this.length = length;
    }

    expand(p: any) {
        let lerpVal = (this.length/3) / this.length;

        let first = p5.Vector.lerp(this.a, this.b, lerpVal);
        let second = p5.Vector.lerp(this.b, this.a, lerpVal);
        let dir = p5.Vector.sub(this.b, this.a);
        dir.rotate(-p.PI/3);
        let firstRef = p5.Vector.add(first, dir);
        dir = p5.Vector.sub(this.a, this.b);
        dir.rotate(p.PI/3);
        let secRef = p5.Vector.add(second, dir);
    
        firstRef = p5.Vector.lerp(first, firstRef, lerpVal);
        secRef = p5.Vector.lerp(second, secRef, lerpVal);

        p.line(first.x, first.y, firstRef.x, firstRef.y);
        p.line(second.x, second.y, secRef.x, secRef.y);  
        p.line(this.a.x, this.a.y, first.x, first.y);  
        p.line(this.b.x, this.b.y, second.x, second.y);  

        let newLines = [];
        newLines.push(new Line(this.a, first, p5.Vector.dist(this.a, first)));
        newLines.push(new Line(first, firstRef, p5.Vector.dist(firstRef, first)));
        newLines.push(new Line(secRef, second, p5.Vector.dist(secRef, second)));
        newLines.push(new Line(second, this.b, p5.Vector.dist(this.b, second)));

        return newLines;
    }
}