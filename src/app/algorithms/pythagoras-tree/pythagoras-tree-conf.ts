import * as p5 from 'p5';
import { ConfigurableFractal } from '../fractal-configurable';
import { AnimationStateManagerService } from 'src/app/services/animation-state-manager.service';
import { Rectangle } from './rectangle';

export class PythagorasTreeConfigurable extends ConfigurableFractal {
    private rectSize: number;
    private root: Rectangle;
    private fixedRoot: Rectangle;
    private fixedAngle: boolean;
    private b_fixedRoot: boolean;
    private angle = 0;

    constructor(animationStateManagerService: AnimationStateManagerService) {
        super(animationStateManagerService);
        this.rectSize = 75;
        this.fixedAngle = true;
        this.b_fixedRoot = true;
        this.iter = 0;
    }

    init(parentId: string, width: number, height: number, canvasColor: string) {
        super.init(parentId, width, height, canvasColor);

        this.fixedRoot = new Rectangle(new p5.Vector(this.width / 2 - this.rectSize / 2, this.height / 1.25 - this.rectSize), 
                                    new p5.Vector(this.width / 2 + this.rectSize / 2, this.height / 1.25 - this.rectSize),
                                    new p5.Vector(this.width / 2 - this.rectSize / 2, this.height / 1.25),
                                    new p5.Vector(this.width / 2 + this.rectSize / 2, this.height / 1.25));
        
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
            p.noStroke();
            p.fill(this.color);
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
                if(!this.b_fixedRoot) {
                    p.push();
                    p.background(this.canvasColor);
                    p.frameRate(60);
                    p.rectMode(p.CENTER);
                    p.translate(p.mouseX, p.mouseY);
                    p.rotate(this.angle);
                    p.rect(0, 0, this.rectSize, this.rectSize);
                    p.pop();
                }
                else if(!this.fixedAngle && this.root.commonPointOfChildren == null) {
                    p.push();               
                    p.background(this.canvasColor);
                    p.stroke(this.color);
                    p.frameRate(60);
                    
                    let center = p5.Vector.lerp(this.root.A, this.root.B, 0.5);
                    let heading = p.createVector(p.mouseX, p.mouseY);
                    let arrow = p5.Vector.lerp(center, heading, this.root.size * 0.5 / p5.Vector.dist(heading, center));
                    
                    p.push();
                    p.noFill();
                    p.circle(center.x, center.y, this.root.size);
                    p.pop();    
                    this.root.draw(p);
                    p.line(center.x, center.y, arrow.x, arrow.y);            
                    p.pop();
                }
                else {
                    let newRects: Rectangle[] = [];
                    for(let i = this.iter; i < this.list.length; i++) {
                        this.list[i].draw(p);
                        let left = this.list[i].expandLeft(p);
                        let right = this.list[i].expandRight(p);
                        newRects.push(left);
                        newRects.push(right);
                    }
                    this.iter = this.list.length;
                    this.rollBackList$.next(this.list);
                    this.list = this.list.concat(newRects);
                }
            }
        }  

        p.handleMousePressed = () => {
            if(this.play && !this.fixedAngle) {
                let center = p5.Vector.lerp(this.root.A, this.root.B, 0.5);
                let heading = p.createVector(p.mouseX, p.mouseY);
                let commonPoint = p5.Vector.lerp(center, heading, this.root.size * 0.5 / p5.Vector.dist(heading, center));
                this.root.setCommonPointOfChildren(commonPoint);

                p.background(this.canvasColor);
            }
            else if(this.play && !this.b_fixedRoot) {
                let center = p.createVector(p.mouseX, p.mouseY);
                let v1 = p.createVector(p.mouseX + this.rectSize / 2, p.mouseY + this.rectSize / 2);
                let dir = p5.Vector.sub(center, v1);
                
                dir.rotate(this.angle);
                let A = p5.Vector.add(center, dir);

                dir = p5.Vector.sub(v1, center);
                dir.rotate(this.angle);
                let D = p5.Vector.add(center, dir);

                dir = p5.Vector.sub(D, center);
                dir.rotate(p.PI/2);
                let C = p5.Vector.add(center, dir);
                
                dir = p5.Vector.sub(D, center);
                dir.rotate(-p.PI/2);
                let B = p5.Vector.add(center, dir);

                let customRoot = new Rectangle(A, B, C, D);
                this.root = customRoot;
                this.list = [this.root];
                this.b_fixedRoot = true;
            }
            
        }

        p.mouseWheel = (event) => {
            if(this.play && !this.b_fixedRoot) {
                event.preventDefault();
                if(event.delta > 0) {
                    this.angle += 0.1;
                }
                else if(event.delta < 0 ) {
                    this.angle -= 0.1;
                }
            }
        }
    }

    //#region Setters
    setConfigurables(p: any) {
        p.frameRate(this.frameRate);
        p.fill(this.color);
    }

    setStop() {
        this.list = [this.root];
        this.root.setCommonPointOfChildren(null);
        this.iter = 0;
        super.setStop();
    }

    setRectSize(obj: any, rectSize: number) {
        obj.rectSize = rectSize;
        obj.root = new Rectangle(new p5.Vector(obj.width / 2 - obj.rectSize / 2, obj.height / 1.25 - obj.rectSize), 
                                    new p5.Vector(obj.width / 2 + obj.rectSize / 2, obj.height / 1.25 - obj.rectSize),
                                    new p5.Vector(obj.width / 2 - obj.rectSize / 2, obj.height / 1.25),
                                    new p5.Vector(obj.width / 2 + obj.rectSize / 2, obj.height / 1.25));
        obj.setStop();
    }

    setFixedAngle(obj: any, value: boolean) {
        obj.fixedAngle = value;
        if(!obj.fixedAngle) {
            obj.root.setCommonPointOfChildren(null);
        }
        obj.setStop();
    }

    setFixedRoot(obj: any, value: boolean) {
        obj.b_fixedRoot = value;
        if(value) {
            obj.root = obj.fixedRoot;
        }
        obj.setStop();
    }
    //#endregion
}

