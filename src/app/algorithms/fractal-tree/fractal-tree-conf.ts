import * as p5 from 'p5';
import { ConfigurableFractal } from '../fractal-configurable';
import { AnimationStateManagerService } from 'src/app/services/animation-state-manager.service';
import { Line } from './line';
import { IAlgorithmConfiguration } from 'src/app/models/algorithm-configuration';
import { BehaviorSubject } from 'rxjs';

export class FractalTreeConfigurable extends ConfigurableFractal {
    private root: Line;
    private lines: Line[];
    private fixedRoot: Line;
    private customRoot: Line;
    private useFixedRoot: boolean;
    private length: number;
    private angle: number;
    private lerpPercentage: number;
    private rotation: number;
    private branches: number;
    private randomAngle: boolean;
    private randomLerp: boolean;

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
            minValue: 50,
            maxValue: 500,
            step: 1,
            func: this.setLength,
            bind: new BehaviorSubject<number>(200)
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
            name: "Véletlenszerű szög",
            type: "checkbox",
            value: 0,
            func: this.setRandomAngle,
            bind: new BehaviorSubject<number>(0)
        },
        {
            name: "Fixált kezdővonal",
            type: "checkbox",
            value: 1,
            func: this.setUseFixedRoot
        },
        {
            name: "Szivárvány mód",
            type: "checkbox",
            value: 0,   
            func: this.setRainbowMode,
            bind: new BehaviorSubject<number>(0)
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
        this.CONFIGURATIONS[3].bind.next(this.length);
        this.angle = Math.PI / 4;
        this.lerpPercentage = 0.8;
        this.rotation = 0;
        this.branches = 2;
        this.randomAngle = false;
        this.randomLerp = false;

        this.fixedRoot = new Line(
            new p5.Vector(this.width / 2, this.height - this.length),
            new p5.Vector(this.width / 2, this.height)
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

                    for (let i = this.iter; i < this.lines.length; i++) {
                        if(this.rainbowMode) {
                            let h = p.map(i, this.iter, this.lines.length, 0, 360);
                            this.color = p.color(h, 255, 255);
                        }
                        this.lines[i].setColor(this.color);
                        this.lines[i].draw(p);
                        if(!this.randomAngle) {
                            tempLines = tempLines.concat(this.lines[i].branch(p, this.angle, this.angle, this.lerpPercentage));
                        }
                        else {
                            let angleLeft = p.radians(p.random(90));
                            let angleRight = p.radians(p.random(90));
                            tempLines = tempLines.concat(this.lines[i].branch(p, angleLeft, angleRight, this.lerpPercentage));
                        }

                        if (this.branches == 3) {
                            let dir = p5.Vector.sub(this.lines[i].A, this.lines[i].B);
                            let offset = p5.Vector.add(this.lines[i].A, dir);
                            let adjOffset = p5.Vector.lerp(this.lines[i].A, offset, this.lerpPercentage);
                            tempLines.push(new Line(adjOffset, this.lines[i].A));
                        }
                    }

                    this.list.push(this.lines.length)
                    this.rollBackList$.next(this.list);
                    this.iter = this.lines.length;
                    this.lines = this.lines.concat(tempLines);
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
                this.customRoot.setColor(this.color);
                this.root = this.customRoot;
                this.lines = [this.root];
            }
        }
    }

    _rollBack(p: any) {
        let to = 0;
        for(let i = 0; i <= +this.rollBackTo; i++) {
            to = to * this.branches + 1;
        }

        if (this.rollBack) {
            if (this.play) {
                this.rollBack = false;
                let temp = this.lines.slice(0, to);
                this.lines = temp;
                this.iter = (to - 1) / this.branches;
                temp = this.list.slice(0, this.rollBackTo);
                this.list = temp;
            }
            else {
                p.background(this.canvasColor);
                for (let i = 0; i < (to - 1) / this.branches; i++) {
                    this.lines[i].draw(p);
                }
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

    setLength(obj: FractalTreeConfigurable, value: number) {
        obj.length = value;
        obj.CONFIGURATIONS[3].bind.next(value);
        obj.fixedRoot = new Line(
            new p5.Vector(obj.width / 2, obj.height - obj.length),
            new p5.Vector(obj.width / 2, obj.height)
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

    setUseFixedRoot(obj: FractalTreeConfigurable, value: boolean): void {
        obj.useFixedRoot = value;
        obj.rotation = 0;
        obj.setStop();
    }

    setAngle(obj: FractalTreeConfigurable, angle: number): void {
        obj.angle = angle * Math.PI / 180;
        obj.setStop();
        obj.randomAngle = false;
        obj.CONFIGURATIONS[7].bind.next(0);
    }

    setLerpPercentage(obj: FractalTreeConfigurable, percentage: number): void {
        obj.lerpPercentage = percentage / 100;
        obj.setStop();
    }

    setBranches(obj: FractalTreeConfigurable, branches: number) {
        obj.branches = branches;
        obj.setStop();
    }

    setRandomAngle(obj: FractalTreeConfigurable, value: boolean) {
        obj.randomAngle = value;
        obj.setStop();
        obj.CONFIGURATIONS[7].bind.next(value);
    }

    recalculateCustomRoot() {
        if(this.customRoot != null) {
            let center = p5.Vector.lerp(this.customRoot.A, this.customRoot.B, .5);
            let x = new p5.Vector(center.x, center.y - this.length / 2);
            let y = new p5.Vector(center.x, center.y + this.length / 2);
    
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
        obj.CONFIGURATIONS[9].bind.next(0);
        obj.setStop();
    }

    setRainbowMode(obj: any, value: boolean): void {
        obj.rainbowMode = value;
        obj.CONFIGURATIONS[9].bind.next(value);
        obj.setStop();
    }
}