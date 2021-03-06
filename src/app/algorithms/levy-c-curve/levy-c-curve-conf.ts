import * as p5 from 'p5';
import { ConfigurableFractal } from '../fractal-configurable';
import { AnimationStateManagerService } from 'src/app/services/animation-state-manager.service';
import { Line } from './line';
import { BehaviorSubject } from 'rxjs';

export class LevyCCurveConfigurable extends ConfigurableFractal {
    private lines: Line[];
    private root: Line;
    private fixedRoot: Line;
    private customRoot: Line;
    private useFixedRoot: boolean;
    private length: number;
    private direction: number;
    private rotation: number;
    private angle: number;

    readonly CONFIGURATIONS = [
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
            value: 1,
            minValue: 100,
            maxValue: 500,
            step: 1,
            func: this.setLength,
            bind: new BehaviorSubject<number>(1)
        },
        {
            name: "Szög",
            type: "slider",
            value: 45,
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
            type: "radio",
            values: [
                {
                    name: "Fel",
                    value: -1,
                    default: true
                },
                {
                    name: "Le",
                    value: 1,
                    default: false
                }
            ],
            func: this.setDirection
        },
        {
            name: "Szivárvány mód",
            type: "checkbox",
            value: 0,   
            func: this.setRainbowMode,
            bind: new BehaviorSubject<number>(0)
        }
    ]

    constructor(animationStateManagerService: AnimationStateManagerService) {
        super(animationStateManagerService);
    }

    init(parentId: string, width: number, height: number, canvasColor: string) {
        super.init(parentId, width, height, canvasColor);

        this.lines = [];
        this.customRoot = null;
        this.useFixedRoot = true;
        this.direction = -1;
        this.rotation = 0;
        this.angle = Math.PI / 4;
        this.length = this.width / 3;
        this.CONFIGURATIONS[3].bind.next(this.length);

        this.fixedRoot = new Line(
            new p5.Vector(this.width / 2 - this.length / 2, this.height - 100),
            new p5.Vector(this.width / 2 + this.length / 2, this.height - 100)
        );
        this.fixedRoot.setColor(this.color);
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
            p.background(this.canvasColor);
            p.frameRate(this.frameRate);
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
                    let tempLines: Line[] = [];

                    for (let i = this.iter; i < this.lines.length; i++) {
                        if(this.rainbowMode) {
                            let h = p.map(i, this.iter, this.lines.length, 0, 360);
                            this.color = p.color(h, 255, 255);
                        }
                        this.lines[i].setColor(this.color);
                        this.lines[i].draw(p);
                        tempLines = tempLines.concat(this.lines[i].expand(p, this.direction, this.angle));
                    }

                    this.list.push(this.lines.length);
                    this.rollBackList$.next(this.list);
                    this.iter = this.lines.length;
                    this.lines = this.lines.concat(tempLines);
                }
            }
        }

        p.mouseWheel = (event) => {
            if (this.play && !this.useFixedRoot) {
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
                this.lines = [this.root];
            }
        }
    }

    _rollBack(p: any) {
        let to = 0;
        for(let i = 0; i <= +this.rollBackTo; i++) {
            to = to * 2 + 1;
        }

        if (this.rollBack) {
            if (this.play) {
                this.rollBack = false;
                let temp = this.lines.slice(0, to);
                this.lines = temp;
                this.iter = (to - 1) / 2;
                temp = this.list.slice(0, this.rollBackTo);
                this.list = temp;
            }
            else {
                p.background(this.canvasColor);
                let from = (((to - 1) / 2) - 1) / 2;
                if(from < 0) {
                    from = 0;
                }
                for (let i = from; i < (to - 1) / 2; i++) {
                    this.lines[i].draw(p);
                }
            }
        }
    }

    //#region Setters
    setStop() {
        this.fixedRoot = new Line(
            new p5.Vector(this.width / 2 - this.length / 2, this.height - 100),
            new p5.Vector(this.width / 2 + this.length / 2, this.height - 100)
        );
        this.fixedRoot.setColor(this.color);
        if (this.useFixedRoot) {
            this.root = this.fixedRoot;
        }
        else {
            this.root = this.customRoot;
        }
        if(this.root != null) {
            this.root.setColor(this.color);
        }
        this.lines = [this.root];
        this.list = [];
        this.iter = 0;
        super.setStop();
    }

    setLength(obj: any, value: number) {
        obj.length = value;
        obj.CONFIGURATIONS[3].bind.next(length);
        obj.fixedRoot = new Line(
            new p5.Vector(obj.width / 2 - obj.length / 2, obj.height - 100),
            new p5.Vector(obj.width / 2 + obj.length / 2, obj.height - 100)
        );
        obj.fixedRoot.setColor(obj.color);
        obj.recalculateCustomRoot();

        if (obj.useFixedRoot) {
            obj.root = obj.fixedRoot;
        }
        else {
            obj.root = obj.customRoot;
        }
        if(!obj.play) {
            obj.lines = [obj.root];
        }
    }

    setConfigurables(p: any) {
        p.frameRate(this.frameRate);
        p.stroke(this.color);
        p.strokeWeight(this.strokeWeight);
    }

    setUseFixedRoot(obj: LevyCCurveConfigurable, value: boolean): void {
        obj.useFixedRoot = value;
        obj.customRoot = null;
        obj.rotation = 0;
        obj.setStop();
    }

    setDirection(obj: LevyCCurveConfigurable, direction: number): void {
        obj.direction = direction;
        obj.setStop();
    }

    setAngle(obj: any, angle: number): void {
        obj.angle = angle * Math.PI / 180;
        obj.setStop();
    }

    recalculateCustomRoot() {
        if(this.customRoot != null) {
            let center = p5.Vector.lerp(this.customRoot.A, this.customRoot.B, .5);
            let x = new p5.Vector(center.x - this.length / 2, center.y);
            let y = new p5.Vector(center.x + this.length / 2, center.y);
    
            let xDir = p5.Vector.sub(x, center);
            xDir.rotate(this.rotation);
    
            let yDir = p5.Vector.sub(y, center);
            yDir.rotate(this.rotation);
    
            let xOffset = p5.Vector.add(center, xDir);
            let yOffset = p5.Vector.add(center, yDir);
    
            this.customRoot = new Line(xOffset, yOffset);
            this.customRoot.setColor(this.color);
        }
    }

    setColor(obj: any, color: string): void {
        obj.color = color;
        obj.rainbowMode = false;
        obj.CONFIGURATIONS[7].bind.next(0);
        obj.setStop();
    }

    setRainbowMode(obj: any, value: boolean): void {
        obj.rainbowMode = value;
        obj.CONFIGURATIONS[7].bind.next(value);
        obj.setStop();
    }
    //#endregion
}
