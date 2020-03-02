import * as p5 from 'p5';
import { Fractal } from '../fractal';
import { AnimationStateManagerService } from 'src/app/services/animation-state-manager.service';

export class HTreeConfigurable extends Fractal {
    private length: number;
    private root: Line;
    private fixedRoot: Line;
    private customRoot: Line;
    private useFixedRoot: boolean;
    private rotation: number;
    private iter;

    constructor(animationStateManagerService: AnimationStateManagerService) {
        super(animationStateManagerService);
        this.iter = 0;
        this.useFixedRoot = true;
        this.rotation = 0;
    }

    init(parentId: string, width: number, height: number, canvasColor: string) {
        super.init(parentId, width, height, canvasColor);
        
        this.length = this.width / 2;
        this.fixedRoot = new Line(
            new p5.Vector(this.width / 2 - this.length / 2, this.height / 2), 
            new p5.Vector(this.width / 2 + this.length / 2, this.height / 2)
        );
        this.root = this.fixedRoot;
        this.list.push(this.root);
        this.rollBackList$.next(this.list);
            
        this.createCanvas();
    }

    sketch(p: any) {
        p.setup = () => {
            this.canvas = p.createCanvas(this.width, this.height);
            this.canvas.parent(this.parentId);
            this.canvas.mousePressed(p.handleMousePressed);
            
            p.background(this.canvasColor);
            p.frameRate(this.frameRate);    
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
                if(!this.useFixedRoot && this.customRoot == null) {
                    p.push();
                    p.background(this.canvasColor);
                    p.frameRate(60);
                    p.translate(p.mouseX, p.mouseY);
                    p.rotate(this.rotation);
                    p.line(-this.length / 2, 0, this.length / 2, 0);
                    p.pop();
                }
                else {
                    let tempLines: Line[] = [];
            
                    for(let i = this.iter; i < this.list.length; i++) {
                        this.list[i].draw(p);
                        
                        let left = this.list[i].expandLeft(p);
                        let right = this.list[i].expandRight(p);
                        
                        tempLines.push(left);
                        tempLines.push(right);
                    }

                    this.iter = this.list.length;
                    this.list = this.list.concat(tempLines);
                    this.rollBackList$.next(this.list);
                }         
            }     
        }

        p.mouseWheel = (event) => {
            if(this.play && !this.useFixedRoot) {
                event.preventDefault();
                if(event.delta > 0) {
                    this.rotation += 0.1;
                }
                else if(event.delta < 0 ) {
                    this.rotation -= 0.1;
                }
            }
        }

        p.handleMousePressed = () => {
            if(this.play && !this.useFixedRoot) {
                let center = p.createVector(p.mouseX, p.mouseY);
                let x = p.createVector(p.mouseX - this.length / 2, p.mouseY);
                let y = p.createVector(p.mouseX + this.length / 2, p.mouseY);

                let xDir = p5.Vector.sub(x, center);
                xDir.rotate(this.rotation);

                let yDir = p5.Vector.sub(y, center);
                yDir.rotate(this.rotation);

                let xOffset = p5.Vector.add(center, xDir);
                let yOffset = p5.Vector.add(center, yDir);

                p.line(xOffset.x, xOffset.y, yOffset.x, yOffset.y);
                this.rotation = 0;
                this.customRoot = new Line(xOffset, yOffset);
                this.root = this.customRoot;
                this.list = [this.root];
            }
        }
    }

    setConfigurables(p: any) {
        p.frameRate(this.frameRate);
        p.stroke(this.color);
        p.strokeWeight(this.strokeWeight);
    }

    setStop() {
        this.list = [this.root];
        this.iter = 0;
        super.setStop();
    }

    setLength(obj: any, length: number): void {
        obj.length = length;
        obj.fixedRoot = new Line(
            new p5.Vector(obj.width / 2 - obj.length / 2, obj.height / 2), 
            new p5.Vector(obj.width / 2 + obj.length / 2, obj.height / 2)
        );
        obj.root = obj.fixedRoot;
        obj.setStop();
    }

    setCustomRoot(obj: any, value: number): void {
        obj.useFixedRoot = value;
        obj.customRoot = null;
        obj.rotation = 0;
        if(!obj.useFixedRoot) {
            obj.root = obj.fixedRoot;
            obj.list = [obj.root];
        }
        obj.setStop();
    }
}

class Line {
    public A;
    public B;

    constructor(A, B) {
        this.A = A;
        this.B = B;
    }

    expandLeft(p: any) {
        let distance = p5.Vector.dist(this.A, this.B);
        let lerpAmount = ((distance / Math.sqrt(2)) / distance) / 2;

        let dir = p5.Vector.sub(this.A, this.B);
        dir.rotate(p.PI / 2);
        let xOffset = p5.Vector.add(this.A, dir)
        let x = p5.Vector.lerp(this.A, xOffset, lerpAmount);

        dir.rotate(-p.PI);
        let yOffset = p5.Vector.add(this.A, dir);
        let y = p5.Vector.lerp(this.A, yOffset, lerpAmount);

        return new Line(x, y);
    }

    expandRight(p: any): Line {
        let distance = p5.Vector.dist(this.A, this.B);
        let lerpAmount = ((distance / Math.sqrt(2)) / distance) / 2;

        let dir = p5.Vector.sub(this.B, this.A);
        dir.rotate(p.PI / 2);
        let xOffset = p5.Vector.add(this.B, dir);
        let x = p5.Vector.lerp(this.B, xOffset, lerpAmount);

        dir.rotate(-p.PI);
        let yOffset = p5.Vector.add(this.B, dir);
        let y = p5.Vector.lerp(this.B, yOffset, lerpAmount);

        return new Line(x, y);
    }

    draw(p: any) {
        p.line(this.A.x, this.A.y, this.B.x, this.B.y);
    }
}