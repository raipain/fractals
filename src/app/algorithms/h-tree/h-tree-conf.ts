import * as p5 from 'p5';
import { ConfigurableFractal } from '../fractal-configurable';
import { AnimationStateManagerService } from 'src/app/services/animation-state-manager.service';
import { Line } from './line';
import { IAlgorithmConfiguration } from 'src/app/models/algorithm-configurations';

export class HTreeConfigurable extends ConfigurableFractal {
    private length: number;
    private root: Line;
    private fixedRoot: Line;
    private customRoot: Line;
    private useFixedRoot: boolean;
    private rotation: number;

    readonly CONFIGURATIONS: IAlgorithmConfiguration[] = [
        {
            name: "Gyorsaság",
            type: "slider",
            value: 1,
            minValue: 1,
            maxValue: 200,
            step: 1,
            func: this.setFrameRate
        },
        {
            name: "Vonalvastagság",
            type: "slider",
            value: 3,
            minValue: 1,
            maxValue: 10,
            step: 1,
            func: this.setStrokeWeight
        },
        {
            name: "Vonalhosszúság",
            type: "slider",
            value: 200,
            minValue: 50,
            maxValue: 500,
            step: 1,
            func: this.setLength
        },
        {
            name: "Fixált kezdővonal",
            type: "checkbox",
            value: 1,
            func: this.setUseFixedRoot
        },
        {
            name: "Szín",
            type: "colorpicker",
            func: this.setColor
        }
    ];

    constructor(animationStateManagerService: AnimationStateManagerService) {
        super(animationStateManagerService);
    }

    init(parentId: string, width: number, height: number, canvasColor: string) {
        super.init(parentId, width, height, canvasColor);

        this.useFixedRoot = true;
        this.length = this.width / 3;
        this.rotation = 0;

        this.fixedRoot = new Line(
            new p5.Vector(this.width / 2 - this.length / 2, this.height / 2),
            new p5.Vector(this.width / 2 + this.length / 2, this.height / 2)
        );

        this.root = this.fixedRoot;
        this.list = [this.root];

        this.createCanvas();
    }

    sketch(p: any) {
        p.setup = () => {
            this.canvas = p.createCanvas(this.width, this.height);
            this.canvas.parent(this.parentId);
            this.canvas.mousePressed(p.handleMousePressed);

            p.frameRate(this.frameRate);
            p.background(this.canvasColor);
            p.color(this.color);
            p.strokeWeight(this.strokeWeight);
        }

        p.draw = () => {
            this.setConfigurables(p);

            if (this.rollBack) {
                this._rollBack(p);
            }
            else if (this.stop) {
                p.background(this.canvasColor);
                if (this.root != null) {
                    this.root.draw(p);
                }
            }
            else if (this.play) {
                if (!this.useFixedRoot && this.customRoot == null) {
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

                    for (let i = this.iter; i < this.list.length; i++) {
                        this.list[i].draw(p);

                        let left = this.list[i].expandLeft(p);
                        let right = this.list[i].expandRight(p);

                        tempLines.push(left);
                        tempLines.push(right);
                    }

                    this.rollBackList$.next(this.list);
                    this.iter = this.list.length;
                    this.list = this.list.concat(tempLines);
                }
            }
        }

        p.mouseWheel = (event) => {
            if (this.play && !this.useFixedRoot && this.customRoot == null) {
                event.preventDefault();
                if (event.delta > 0) {
                    this.rotation += 0.1;
                }
                else if (event.delta < 0) {
                    this.rotation -= 0.1;
                }
            }
        }

        p.handleMousePressed = () => {
            if (this.play && !this.useFixedRoot && this.customRoot == null) {
                let center = p.createVector(p.mouseX, p.mouseY);
                let x = p.createVector(p.mouseX - this.length / 2, p.mouseY);
                let y = p.createVector(p.mouseX + this.length / 2, p.mouseY);

                let xDir = p5.Vector.sub(x, center);
                xDir.rotate(this.rotation);

                let yDir = p5.Vector.sub(y, center);
                yDir.rotate(this.rotation);

                let xOffset = p5.Vector.add(center, xDir);
                let yOffset = p5.Vector.add(center, yDir);

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
        this.fixedRoot = new Line(
            new p5.Vector(this.width / 2 - this.length / 2, this.height / 2),
            new p5.Vector(this.width / 2 + this.length / 2, this.height / 2)
        );
        if (this.useFixedRoot) {
            this.root = this.fixedRoot;
        }
        else {
            this.root = this.customRoot;
        }
        this.list = [this.root];
        this.iter = 0;
        super.setStop();
    }

    setLength(obj: any, length: number): void {
        obj.length = length;
        obj.setStop();
    }

    setUseFixedRoot(obj: any, value: number): void {
        obj.useFixedRoot = value;
        obj.rotation = 0;
        obj.setStop();
    }
}

