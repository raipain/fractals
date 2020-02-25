import * as p5 from 'p5';
import { Fractal } from '../fractal';

export class KochCurveConfigurable extends Fractal { 
    private length: number;
    private lines: Line[];
    private root: Line;
    private direction: number;
    
    constructor() {
        super();
        this.direction = -1;
    }

    init(parentId: string, width: number, height: number, canvasColor: string) {
        super.init(parentId, width, height, canvasColor);
        
        this.length = this.width / 2;
        this.root = new Line(new p5.Vector(this.width / 2 - this.length / 2, this.height / 2), 
                    new p5.Vector(this.width /2 + this.length / 2, this.height / 2), 
                    this.length);

        this.lines = [this.root];

        this.createCanvas();
    }

    sketch(p: any) {
        p.setup = () => {
            let canvas = p.createCanvas(this.width, this.height);
            canvas.parent(this.parentId);
            
            p.frameRate(this.frameRate);
            p.background(this.canvasColor);
            p.stroke(this.color);
            p.strokeWeight(this.strokeWeight);
        }
        
        p.draw = () => {
            this.setConfigurables(p);

            if(this.stop) {
                p.background(this.canvasColor);
                p.line(this.lines[0].a.x, this.lines[0].a.y, this.lines[0].b.x, this.lines[0].b.y);
            }
            else if(this.play) {
                p.background(this.canvasColor);
                let newLines = [];
                for(let i = 0; i < this.lines.length; i++) {
                    let temp = this.lines[i].expand(p, this.direction);
                    for(let j = 0; j < temp.length; j++) {
                        newLines.push(temp[j]);
                    }
                }
                this.lines = newLines;
            } 
        }
    }

    setRoot(a: number, b: number, length: number): void {
        this.root = new Line(a, b, length);
    }
     
    setStop() {
        super.setStop();
        this.lines = [this.root];
    }

    setConfigurables(p: any) {
        p.frameRate(this.frameRate);
        p.stroke(this.color);
        p.strokeWeight(this.strokeWeight);
    }

    setDirection(obj: any, direction: number): void {
        obj.direction = direction;
    }

    setLength(obj: any, length: number): void {
        obj.length = length;
        obj.root = new Line(new p5.Vector(obj.width / 2 - obj.length / 2, obj.height / 2), 
                    new p5.Vector(obj.width /2 + obj.length / 2, obj.height / 2), 
                    obj.length);
        obj.setStop();
    }
}


class Line {
    public a;
    public b;
    public length;

    constructor(a, b, length) {
        this.a = a;
        this.b = b;
        this.length = length;
    }

    expand(p: any, direction: number) {
        let lerpVal = (this.length/3) / this.length;

        let first = p5.Vector.lerp(this.a, this.b, lerpVal);
        let second = p5.Vector.lerp(this.b, this.a, lerpVal);
        let dir = p5.Vector.sub(this.b, this.a);
        dir.rotate(-direction * p.PI/3);
        let firstRef = p5.Vector.add(first, dir);
        dir = p5.Vector.sub(this.a, this.b);
        dir.rotate(direction * p.PI/3);
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