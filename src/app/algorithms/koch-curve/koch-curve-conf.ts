import * as p5 from 'p5';
import { Fractal } from '../fractal';
import { AnimationStateManagerService } from 'src/app/services/animation-state-manager.service';

export class KochCurveConfigurable extends Fractal { 
    private length: number;
    private lines: Line[];
    private root: Line;
    private direction: number;
    private iter: number;
    private angle: number;
    
    constructor(animationStateManagerService: AnimationStateManagerService) {
        super(animationStateManagerService);
        this.lines = [];
        this.direction = -1;
        this.iter = 0;
        this.angle = 80 * Math.PI / 180;
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

            if(this.rollBack) {
                this._rollBack(p);
            }
            else if(this.stop) {
                p.background(this.canvasColor);
                this.root.draw(p);
            }
            else if(this.play) {
                p.background(this.canvasColor);
                let newLines = [];
                this.list.push(this.lines.length);
                this.rollBackList$.next(this.list);
                for(let i = this.iter; i < this.lines.length; i++) {
                    this.lines[i].draw(p);
                    let temp = this.lines[i].expand(p, this.direction, this.angle);
                    for(let j = 0; j < temp.length; j++) {
                        newLines.push(temp[j]);
                    }
                }
                this.iter = this.lines.length;
                this.lines = this.lines.concat(newLines); 
                console.log("Lines: " + this.lines.length)
                
            } 
        }
    }

    _rollBack(p: any) {
        let from = this.list[this.rollBackTo - 2];
        let to = this.list[this.rollBackTo - 1];
        if(from == null) {
            from = 0;
        }

        if(this.rollBack) {
            if(this.play) {
                for(let i = this.rollBackTo; i < this.lines.length; i++) {
                    this.lines[i].draw(p);
                }
                this.rollBack = false;
            }
            else {
                p.background(this.canvasColor);
                for(let i = from; i < to; i++) {
                    this.lines[i].draw(p);
                }
            }
        }
    }
     
    //#region Setters
    setStop() {
        super.setStop();
        this.lines = [this.root];
        this.iter = 0;
    }

    setConfigurables(p: any) {
        p.frameRate(this.frameRate);
        p.stroke(this.color);
        p.strokeWeight(this.strokeWeight);
    }

    setDirection(obj: any, direction: number): void {
        obj.direction = direction;
        obj.setStop();
    }

    setLength(obj: any, length: number): void {
        obj.length = length;
        obj.root = new Line(new p5.Vector(obj.width / 2 - obj.length / 2, obj.height / 2), 
                    new p5.Vector(obj.width /2 + obj.length / 2, obj.height / 2), 
                    obj.length);
        obj.setStop();
    }
    //#endregion
}

//#region Line
class Line {
    public a;
    public b;
    public length;

    constructor(a, b, length) {
        this.a = a;
        this.b = b;
        this.length = length;
    }

    expand(p: any, direction: number, angle: number): Line[] {
        let len = this.length / 3;
        let alpha = 180 - 2 * p.degrees(angle);
        let sideLength = (this.length - 2 * len) * p.sin(angle) / p.sin(p.radians(alpha));

        let lerpVal = len / this.length;

        let first = p5.Vector.lerp(this.a, this.b, lerpVal);
        let second = p5.Vector.lerp(this.b, this.a, lerpVal);
        let dir = p5.Vector.sub(this.b, this.a);
        dir.rotate(-direction * angle);
        let firstRef = p5.Vector.add(first, dir);
        dir = p5.Vector.sub(this.a, this.b);
        dir.rotate(direction * angle);
        let secRef = p5.Vector.add(second, dir);
        
        firstRef = p5.Vector.lerp(first, firstRef, sideLength / p5.Vector.dist(first, firstRef));
        secRef = p5.Vector.lerp(second, secRef, sideLength / p5.Vector.dist(second, secRef));

        let newLines = [];
        newLines.push(new Line(this.a, first, p5.Vector.dist(this.a, first)));
        newLines.push(new Line(first, firstRef, p5.Vector.dist(firstRef, first)));
        newLines.push(new Line(secRef, second, p5.Vector.dist(secRef, second)));
        newLines.push(new Line(second, this.b, p5.Vector.dist(this.b, second)));

        return newLines;
    }

    draw(p: any): void {
        p.line(this.a.x, this.a.y, this.b.x, this.b.y);
    }
    //#endregion
}