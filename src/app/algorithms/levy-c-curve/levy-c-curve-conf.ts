import * as p5 from 'p5';
import { Fractal } from '../fractal';

export class LevyCCurveConfigurable extends Fractal {
    private lines: Line[];
    private length: number;
    private direction: number;
    private fixedLine: boolean;
    private setup: boolean;
    private angle: number;
    
    constructor() {
        super();
        this.lines = [];
        this.fixedLine = true;
        this.direction = -1;
        this.setup = false;
        this.angle = 0;
    }
    
    init(parentId: string, width: number, height: number, canvasColor: string) {
        super.init(parentId, width, height, canvasColor);
        this.length = this.width / 3;
        this.lines.push(
            new Line(
                new p5.Vector(this.width / 2 - this.length / 2, this.height / 2), 
                new p5.Vector(this.width / 2 + this.length / 2, this.height / 2)
            )
        );
        this.createCanvas();
    }

    sketch(p: any) {
        p.setup = () => {
            this.canvas = p.createCanvas(this.width, this.height);
            this.canvas.parent(this.parentId);
            this.canvas.mousePressed(p.handleMousePressed);
            p.background(this.canvasColor);
            p.frameRate(this.frameRate);
            p.strokeWeight(this.strokeWeight);

            p.line(this.lines[0].a.x, this.lines[0].a.y, this.lines[0].b.x, this.lines[0].b.y);
        }

        p.draw = () => {
            p.pop();
            this.setConfigurables(p);

            if(this.play && !this.fixedLine && !this.setup) {
                p.frameRate(60);
                p.background(this.canvasColor);
                p.translate(p.mouseX, p.mouseY);
                p.rotate(this.angle);
                p.line(-this.length / 2, 0, this.length / 2, 0);
            }
            else if(this.play && ((!this.fixedLine && this.setup) || this.fixedLine)) {
                p.background(this.canvasColor);
                let tempLines: Line[] = [];

                for(let i = 0; i < this.lines.length; i++) {
                    let length = p5.Vector.dist(this.lines[i].a, this.lines[i].b);
                    let lengthSz = Math.sqrt(length/2 * length);

                    let lerpAmount = lengthSz / length;
        
                    let dir = p5.Vector.sub(this.lines[i].b, this.lines[i].a);
                    dir.rotate(this.direction * p.PI/4);
                    let offset = p5.Vector.add(this.lines[i].a, dir);
                    let adjOffset = p5.Vector.lerp(this.lines[i].a, offset, lerpAmount);

                    tempLines.push(new Line(this.lines[i].a, adjOffset));
                    tempLines.push(new Line(adjOffset, this.lines[i].b));

                    p.line(this.lines[i].a.x, this.lines[i].a.y, adjOffset.x, adjOffset.y);
                    p.line(this.lines[i].b.x, this.lines[i].b.y, adjOffset.x, adjOffset.y);
                }
                this.lines = tempLines;
                p.push();
            }
        }

        p.mouseWheel = (event) => {
            if(this.play && !this.fixedLine && !this.setup) {
                event.preventDefault();
                if(event.delta > 0) {
                    this.angle += 0.1;
                }
                else if(event.delta < 0 ) {
                    this.angle -= 0.1;
                }
            }
        }

        p.handleMousePressed = () => {
            if(this.play && !this.fixedLine && !this.setup) {
                p.line(-this.length / 2, 0, this.length / 2, 0);
                this.setup = true;
                this.angle = 0;
                p.frameRate(this.frameRate); 
                this.lines = [new Line(p.createVector(-this.length / 2, 0), p.createVector(this.length / 2, 0))];
                p.push();
            }
        }
    }

    stop() {
        super.stop();
        this.lines = [];
        this.lines.push(
            new Line(
                new p5.Vector(this.width / 2 - this.length / 2, this.height / 2), 
                new p5.Vector(this.width / 2 + this.length / 2, this.height / 2)
            )
        );
    }

    setLength(obj: any, value: number) {
        obj.length = value;
        obj.stop();
    }

    setConfigurables(p: any) {
        p.frameRate(this.frameRate);
        p.stroke(this.color);
        p.strokeWeight(this.strokeWeight);
    }

    setFixedLine(obj: any, value: number): void {
        obj.fixedLine = value;
        obj.setup = false;
        obj.stop();
    }

    setDirection(obj: any, direction: number): void {
        obj.direction = direction;
        obj.stop();
    }
}

class Line {
    public a: p5.Vector;
    public b: p5.Vector;

    constructor(a: p5.Vector, b: p5.Vector) {
        this.a = a;
        this.b = b;
    }
}

