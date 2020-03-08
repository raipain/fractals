import * as p5 from 'p5';
import { ConfigurableFractal } from '../fractal-configurable';
import { AnimationStateManagerService } from 'src/app/services/animation-state-manager.service';
import { Line } from './line';

export class LevyCCurveConfigurable extends ConfigurableFractal {
    private lines: Line[];
    private length: number;
    private direction: number;
    private fixedLine: boolean;
    private rotation: number;
    private angle: number;
    
    constructor(animationStateManagerService: AnimationStateManagerService) {
        super(animationStateManagerService);
        this.lines = [];
        this.fixedLine = true;
        this.direction = -1;
        this.rotation = 0;
        this.angle = Math.PI / 4;
        this.iter = 0;
    }
    
    init(parentId: string, width: number, height: number, canvasColor: string) {
        super.init(parentId, width, height, canvasColor);
        this.length = this.width / 3;
        this.lines.push(
            new Line(
                new p5.Vector(this.width / 2 - this.length / 2, this.height / 1.5), 
                new p5.Vector(this.width / 2 + this.length / 2, this.height / 1.5)
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
        }

        p.draw = () => {
            this.setConfigurables(p);

            if(this.rollBack) {
                this._rollBack(p);
            }
            else if(this.stop) {
                p.background(this.canvasColor);
                this.lines[0].draw(p);
            }
            else if(this.play) {
                p.background(this.canvasColor);

                if(!this.fixedLine) {
                    p.push();
                    p.frameRate(60);
                    p.translate(p.mouseX, p.mouseY);
                    p.rotate(this.rotation);
                    p.line(-this.length / 2, 0, this.length / 2, 0);
                    p.pop();
                }
                else {
                    let tempLines: Line[] = [];
                    this.list.push(this.lines.length);
                    this.rollBackList$.next(this.list);
    
                    for(let i = this.iter; i < this.lines.length; i++) {
                        this.lines[i].draw(p);
                        tempLines = tempLines.concat(this.lines[i].expand(p, this.direction, this.angle));
                    }

                    this.iter = this.lines.length;
                    this.lines = this.lines.concat(tempLines);
                }
            }
        }

        p.mouseWheel = (event) => {
            if(this.play && !this.fixedLine) {
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
            if(this.play && !this.fixedLine) {
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
                this.fixedLine = true;
                this.rotation = 0;
                this.lines = [new Line(xOffset, yOffset)];
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
        this.lines = [];
        this.list = [];
        this.lines.push(
            new Line(
                new p5.Vector(this.width / 2 - this.length / 2, this.height / 2), 
                new p5.Vector(this.width / 2 + this.length / 2, this.height / 2)
            )
        );
        this.iter = 0;
        super.setStop();
    }
            
    setLength(obj: any, value: number) {
        obj.length = value;
        obj.setStop();
    }

    setConfigurables(p: any) {
        p.frameRate(this.frameRate);
        p.stroke(this.color);
        p.strokeWeight(this.strokeWeight);
    }

    setFixedLine(obj: any, value: number): void {
        obj.fixedLine = value;
        obj.setup = false;
        obj.setStop();
    }

    setDirection(obj: any, direction: number): void {
        obj.direction = direction;
        obj.stop();
    }

    setAngle(obj: any, angle: number): void {
        obj.angle = angle * Math.PI / 180;
        obj.setStop();
    }
    //#endregion
}
