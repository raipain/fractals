import * as p5 from 'p5';
import { ConfigurableFractal } from '../fractal-configurable';
import { AnimationStateManagerService } from 'src/app/services/animation-state-manager.service';
import { Line } from './line';
import { IAlgorithmConfiguration } from 'src/app/models/algorithm-configurations';

export class FractalTreeConfigurable extends ConfigurableFractal {
    private root: Line;
    private fixedRoot: Line;
    private customRoot: Line;
    private useFixedRoot: boolean;
    private length: number;
    private angle: number;
    private lerpPercentage: number;
    private rotation: number;
    private branches: number;

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
            name: "Ágak száma",
            type: "slider",
            value: 2,
            minValue: 2,
            maxValue: 3,
            step: 1,
            func: this.setBranches
        },
        {
            name: "Elforgatási szög",
            type: "slider",
            value: 45,
            minValue: 0,
            maxValue: 90,
            step: 1,
            func: this.setAngle
        },
        {
            name: "Ág mérete (%)",
            type: "slider",
            value: 80,
            minValue: 0,
            maxValue: 100,
            step: 1,
            func: this.setLerpPercentage
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

        this.customRoot = null;
        this.useFixedRoot = true;
        this.length = this.height / 3;
        this.angle = Math.PI / 4;
        this.lerpPercentage = 0.8;
        this.rotation = 0;
        this.branches = 2;

        this.fixedRoot = new Line(
            new p5.Vector(this.width / 2, this.height - this.length),
            new p5.Vector(this.width / 2, this.height)
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
            else if (this.stop && this.root != null) {
                p.background(this.canvasColor);
                if (this.root != null) {
                    this.root.draw(p);
                }
            }
            else if (this.play) {
                if (!this.useFixedRoot && this.customRoot == null) {
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

                    for (let i = this.iter; i < this.list.length; i++) {
                        this.list[i].draw(p);
                        tempLines = tempLines.concat(this.list[i].branch(p, this.angle, this.lerpPercentage));

                        if (this.branches == 3) {
                            let dir = p5.Vector.sub(this.list[i].A, this.list[i].B);
                            let offset = p5.Vector.add(this.list[i].A, dir);
                            let adjOffset = p5.Vector.lerp(this.list[i].A, offset, this.lerpPercentage);
                            tempLines.push(new Line(adjOffset, this.list[i].A));
                        }
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
                let x = p.createVector(p.mouseX, p.mouseY - this.length / 2);
                let y = p.createVector(p.mouseX, p.mouseY + this.length / 2);

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

    setConfigurables(p: any): void {
        p.frameRate(this.frameRate);
        p.stroke(this.color);
        p.strokeWeight(this.strokeWeight);
    }

    setStop() {
        this.fixedRoot = new Line(
            new p5.Vector(this.width / 2, this.height - this.length),
            new p5.Vector(this.width / 2, this.height)
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

    setLength(obj: FractalTreeConfigurable, value: number) {
        obj.length = value;
        obj.setStop();
    }

    setUseFixedRoot(obj: FractalTreeConfigurable, value: boolean): void {
        obj.useFixedRoot = value;
        obj.rotation = 0;
        obj.setStop();
    }

    setAngle(obj: FractalTreeConfigurable, angle: number): void {
        obj.angle = angle * Math.PI / 180;
        obj.setStop();
    }

    setLerpPercentage(obj: FractalTreeConfigurable, percentage: number): void {
        obj.lerpPercentage = percentage / 100;
        obj.setStop();
    }

    setBranches(obj: FractalTreeConfigurable, branches: number) {
        obj.branches = branches;
        obj.setStop();
    }
}