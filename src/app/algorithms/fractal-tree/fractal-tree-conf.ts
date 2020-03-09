import * as p5 from 'p5';
import { ConfigurableFractal } from '../fractal-configurable';
import { AnimationStateManagerService } from 'src/app/services/animation-state-manager.service';
import { Line } from './line';
import { templateJitUrl } from '@angular/compiler';

export class FractalTreeConfigurable extends ConfigurableFractal {
    private root: Line;
    private fixedRoot: Line;
    private length: number;
    private angle: number;
    private lerpPercentage: number;
    private useFixedRoot: boolean;
    private rotation: number;
    private branches: number;

    constructor(animationStateManagerService: AnimationStateManagerService) {
        super(animationStateManagerService);
        this.useFixedRoot = true;
        this.angle = Math.PI / 4;
        this.lerpPercentage = 0.8;
        this.rotation = 0;
        this.branches = 2;
    }

    init(parentId: string, width: number, height: number, canvasColor: string) {
        super.init(parentId, width, height, canvasColor);
        this.length = this.height / 3;
        this.fixedRoot = new Line(
            new p5.Vector(this.width / 2, this.height - this.length), 
            new p5.Vector(this.width / 2, this.height)
        );
        this.root = this.fixedRoot;

        this.list = [this.root];
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
            else if(this.stop && this.root != null) {
                p.background(this.canvasColor);
                this.root.draw(p);
            }
            else if(this.play) {
                console.log(this.useFixedRoot, this.root);
                if(!this.useFixedRoot && this.root == null) {
                    console.log(123);
                    p.background(this.canvasColor);
                    p.push();
                    p.frameRate(60);
                    p.translate(p.mouseX, p.mouseY);
                    p.rotate(this.rotation);
                    p.line(0, -this.length / 2, 0, this.length / 2);
                    p.pop();
                }
                else {
                    let tempLines: Line[] = [];
        
                    for(let i = this.iter; i < this.list.length; i++) {
                        this.list[i].draw(p);
                        tempLines = tempLines.concat(this.list[i].branch(p, this.angle, this.lerpPercentage));

                        if(this.branches == 3) {
                            let dir = p5.Vector.sub(this.list[i].A, this.list[i].B);
                            let offset = p5.Vector.add(this.list[i].A, dir);
                            let adjOffset = p5.Vector.lerp(this.list[i].A, offset, this.lerpPercentage);
                            tempLines.push(new Line(adjOffset, this.list[i].A));
                        }
                    }
                    this.iter = this.list.length;
                    this.rollBackList$.next(this.list);
                    this.list = this.list.concat(tempLines);   
                }
            }   
        }

        p.mouseWheel = (event) => {
            if(this.play && !this.useFixedRoot && this.root == null) {
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
            if(this.play && !this.useFixedRoot && this.root == null) {
                let center = p.createVector(p.mouseX, p.mouseY);
                let x = p.createVector(p.mouseX, p.mouseY - this.length / 2);
                let y = p.createVector(p.mouseX, p.mouseY + this.length / 2);

                let xDir = p5.Vector.sub(x, center);
                xDir.rotate(this.rotation);

                let yDir = p5.Vector.sub(y, center);
                yDir.rotate(this.rotation);

                let xOffset = p5.Vector.add(center, xDir);
                let yOffset = p5.Vector.add(center, yDir);

                p.line(xOffset.x, xOffset.y, yOffset.x, yOffset.y);
                this.rotation = 0;
                this.root = new Line(xOffset, yOffset);
                this.list = [this.root];
                this.rollBackList$.next(this.list);
            }
        }
    }

    setConfigurables(p: any) {
        p.frameRate(this.frameRate);
        p.stroke(this.color);
        p.strokeWeight(this.strokeWeight);
    }

    setStop() {
        if(this.useFixedRoot) {
            this.root = this.fixedRoot;
        }
        else {
            this.root = null;
        }
        this.list = [this.root];
        this.iter = 0;
        super.setStop();
    }

    setLength(obj: any, value: number) {
        obj.length = value;
        obj.fixedRoot = new Line(
            new p5.Vector(obj.width / 2, obj.height - obj.length), 
            new p5.Vector(obj.width / 2, obj.height)
        );
        obj.setStop();
    }

    setUseFixedRoot(obj: any, value: number): void {
        obj.useFixedRoot = value;
        console.log(obj.useFixedRoot);
        obj.setStop();
    }

    setAngle(obj: any, angle: number): void {
        obj.angle = angle * Math.PI / 180;
        obj.setStop();
    }

    setLerpPercentage(obj: any, percentage: number): void {
        obj.lerpPercentage = percentage / 100;
        obj.setStop();
    }

    setBranches(obj: any, branches: number) {
        obj.branches = branches;
        obj.setStop();
    }
}