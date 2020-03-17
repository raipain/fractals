import * as p5 from 'p5';
import { ConfigurableFractal } from '../fractal-configurable';
import { AnimationStateManagerService } from 'src/app/services/animation-state-manager.service';
import { Line } from './line';
import { IAlgorithmConfiguration } from 'src/app/models/algorithm-configuration';

export class KochCurveConfigurable extends ConfigurableFractal {
    private length: number;
    private lines: Line[];
    private root: Line;
    private fixedRoot: Line;
    private customRoot: Line;
    private useFixedRoot: boolean;
    private direction: number;
    private angle: number;
    private rotation: number;

    readonly CONFIGURATIONS: IAlgorithmConfiguration[] = [
        {
            name: "Gyorsaság",
            type: "slider",
            value: 1,
            minValue: 1,
            maxValue: 60,
            step: 1,
            func: this.setFrameRate
        },
        {
            name: "Szín",
            type: "colorpicker",
            func: this.setColor
        },
        {
            name: "Vonalvastagság",
            type: "slider",
            value: 1,
            minValue: 1,
            maxValue: 10,
            step: 1,
            func: this.setStrokeWeight
        },
        {
            name: "Vonalhosszúság",
            type: "slider",
            value: 200,
            minValue: 1,
            maxValue: 500,
            step: 1,
            func: this.setLength
        },
        {
            name: "Szög",
            type: "slider",
            value: 60,
            minValue: 20,
            maxValue: 80,
            step: 1,
            func: this.setAngle
        },
        {
            name: "Fixált kezdővonal",
            type: "checkbox",
            value: 1,
            func: this.setUseFixedRoot
        },
        {
            name: "Irány",
            type: "combobox",
            values: [
                {
                    name: "Fel",
                    value: 1
                },
                {
                    name: "Le",
                    value: -1
                }
            ],
            func: this.setDirection
        },
        {
            name: "Szivárvány mód",
            type: "checkbox",
            value: 0,   
            func: this.setRainbowMode
        }
    ]

    constructor(animationStateManagerService: AnimationStateManagerService) {
        super(animationStateManagerService);
    }

    init(parentId: string, width: number, height: number, canvasColor: string) {
        super.init(parentId, width, height, canvasColor);

        this.customRoot = null;
        this.useFixedRoot = true;
        this.direction = -1;
        this.angle = Math.PI / 3;
        this.rotation = 0;

        this.length = this.width / 2;
        this.fixedRoot = new Line(
            new p5.Vector(this.width / 2 - this.length / 2, this.height / 2),
            new p5.Vector(this.width / 2 + this.length / 2, this.height / 2));

        this.root = this.fixedRoot;
        this.lines = [this.root];

        this.createCanvas();
    }

    sketch(p: any) {
        p.setup = () => {
            this.canvas = p.createCanvas(this.width, this.height);
            this.canvas.parent(this.parentId);
            this.canvas.mousePressed(p.handleMousePressed);

            p.colorMode(p.HSB, 360, 255, 255);
            p.frameRate(this.frameRate);
            p.background(this.canvasColor);
            p.stroke(this.color);
            p.strokeWeight(this.strokeWeight);
        }

        p.draw = () => {
            this.setConfigurables(p);

            if (this.rollBack) {
                this._rollBack(p);
            }
            else if (this.stop) {
                p.background(this.canvasColor);
                if(this.root != null) {
                    this.root.draw(p);
                }
            }
            else if (this.play) {
                p.background(this.canvasColor);

                if (!this.useFixedRoot && this.customRoot == null) {
                    p.push();
                    p.frameRate(60);
                    p.translate(p.mouseX, p.mouseY);
                    p.rotate(this.rotation);
                    p.line(-this.length / 2, 0, this.length / 2, 0);
                    p.pop();
                }
                else {
                    let newLines = [];

                    for (let i = this.iter; i < this.lines.length; i++) {
                        if(this.rainbowMode) {
                            let h = p.map(i, this.iter, this.lines.length, 0, 360);
                            p.stroke(h, 255, 255);
                        }
                        this.lines[i].draw(p);

                        let left = this.lines[i].expandLeft(p, this.direction, this.angle);
                        let right = this.lines[i].expandRight(p, this.direction, this.angle);
                        newLines = newLines.concat(left, right);
                    }

                    this.list.push(this.lines.length);
                    this.rollBackList$.next(this.list);
                    this.iter = this.lines.length;
                    this.lines = this.lines.concat(newLines);
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
                this.lines = [this.root];
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
    }

    _rollBack(p: any) {
        let from = this.list[this.rollBackTo - 2];
        let to = this.list[this.rollBackTo - 1];
        if (from == null) {
            from = 0;
        }

        if (this.rollBack) {
            if (this.play) {
                for (let i = this.rollBackTo; i < this.lines.length; i++) {
                    this.lines[i].draw(p);
                }
                this.rollBack = false;
            }
            else {
                p.background(this.canvasColor);
                for (let i = from; i < to; i++) {
                    this.lines[i].draw(p);
                }
            }
        }
    }

    //#region Setters
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
        this.lines = [this.root];
        this.list = [];
        this.iter = 0;
        super.setStop();
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
        obj.setStop();
    }

    setAngle(obj: any, angle: number): void {
        obj.angle = angle * Math.PI / 180;
        obj.setStop();
    }

    setUseFixedRoot(obj: any, value: number): void {
        obj.fixedLine = value;
        obj.rotation = 0;
        obj.setStop();
    }
    //#endregion
}