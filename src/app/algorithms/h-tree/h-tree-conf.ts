import * as p5 from 'p5';
import { ConfigurableFractal } from '../fractal-configurable';
import { AnimationStateManagerService } from 'src/app/services/animation-state-manager.service';
import { Line } from './line';

export class HTreeConfigurable extends ConfigurableFractal {
    private length: number;
    private root: Line;
    private fixedRoot: Line;
    private customRoot: Line;
    private useFixedRoot: boolean;
    private rotation: number;

    constructor(animationStateManagerService: AnimationStateManagerService) {
        super(animationStateManagerService);
        this.iter = 0;
        this.useFixedRoot = true;
        this.rotation = 0;
    }

    init(parentId: string, width: number, height: number, canvasColor: string) {
        super.init(parentId, width, height, canvasColor);
        
        this.length = this.width / 3
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

