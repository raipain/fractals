import * as p5 from 'p5';
import { ConfigurableFractal } from '../fractal-configurable';
import { AnimationStateManagerService } from 'src/app/services/animation-state-manager.service';
import { Rectangle } from './rectangle';
import { IAlgorithmConfiguration } from 'src/app/models/algorithm-configuration';
import { BehaviorSubject } from 'rxjs';

export class PythagorasTreeConfigurable extends ConfigurableFractal {
    private root: Rectangle;
    private rectangles: Rectangle[];
    private fixedRoot: Rectangle;
    private customRoot: Rectangle;
    private useFixedRoot: boolean;
    private angle: number
    private fixedAngle: number;
    private customAngle: number;
    private useFixedAngle: boolean;
    private rectSize: number;
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
            name: "Fixált szög",
            type: "checkbox",
            value: 1,
            func: this.setFixedAngle
        },
        {
            name: "Fixált gyökér",
            type: "checkbox",
            value: 1,
            func: this.setFixedRoot
        },
        {
            name: "Oldalhosszúság",
            type: "slider",
            value: 1,
            minValue: 10,
            maxValue: 400,
            step: 1,
            func: this.setRectSize,
            bind: new BehaviorSubject<number>(1)
        },
        {
            name: "Szín",
            type: "colorpicker",
            func: this.setColor
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

        this.fixedAngle = Math.PI / 2;
        this.customAngle = null;
        this.angle = this.fixedAngle;
        this.useFixedAngle = true;
        this.customRoot = null;
        this.useFixedRoot = true;
        this.useFixedAngle = true;
        this.rectSize = 75;
        this.CONFIGURATIONS[3].bind.next(this.rectSize);
        this.rotation = 0;

        this.fixedRoot = new Rectangle(new p5.Vector(this.width / 2 - this.rectSize / 2, this.height / 1.25 - this.rectSize),
            new p5.Vector(this.width / 2 + this.rectSize / 2, this.height / 1.25 - this.rectSize),
            new p5.Vector(this.width / 2 - this.rectSize / 2, this.height / 1.25),
            new p5.Vector(this.width / 2 + this.rectSize / 2, this.height / 1.25));
        this.fixedRoot.setColor(this.color);

        this.root = this.fixedRoot;
        this.rectangles = [this.root];

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
            p.fill(this.color);
            p.noStroke();
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
                    p.rectMode(p.CENTER);
                    p.translate(p.mouseX, p.mouseY);
                    p.rotate(this.rotation);
                    p.rect(0, 0, this.rectSize, this.rectSize);
                    p.pop();
                }
                else if (!this.useFixedAngle && this.customAngle == null) {
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
                    for (let i = this.iter; i < this.rectangles.length; i++) {
                        if(this.rainbowMode) {
                            let h = p.map(i, this.iter, this.rectangles.length, 0, 360);
                            this.color = p.color(h, 255, 255);
                        }
                        this.rectangles[i].setColor(this.color);
                        this.rectangles[i].draw(p);
                        let left = this.rectangles[i].expandLeft(p, this.angle);
                        let right = this.rectangles[i].expandRight(p, this.angle);
                        newRects.push(left);
                        newRects.push(right);
                    }
                    this.list.push(this.rectangles.length);
                    this.rollBackList$.next(this.list);
                    this.iter = this.rectangles.length;
                    this.rectangles = this.rectangles.concat(newRects);
                }
            }
        }

        p.handleMousePressed = () => {
            if (this.play && !this.useFixedRoot && !this.useFixedAngle && (this.customRoot == null || this.customAngle == null)) {
                if (this.customRoot == null) {
                    p.setCustomRoot();
                }
                else if (this.customAngle == null) {
                    p.setCustomAngle();
                }
            }
            else if (this.play && !this.useFixedRoot && this.customRoot == null) {
                p.setCustomRoot();
            }
            else if (this.play && !this.useFixedAngle && this.customAngle == null) {
                p.setCustomAngle();
            }
        }

        p.setCustomRoot = () => {
            let center = p.createVector(p.mouseX, p.mouseY);
            let v1 = p.createVector(p.mouseX + this.rectSize / 2, p.mouseY + this.rectSize / 2);
            let dir = p5.Vector.sub(center, v1);

            dir.rotate(this.rotation);
            let A = p5.Vector.add(center, dir);

            dir = p5.Vector.sub(v1, center);
            dir.rotate(this.rotation);
            let D = p5.Vector.add(center, dir);

            dir = p5.Vector.sub(D, center);
            dir.rotate(p.PI / 2);
            let C = p5.Vector.add(center, dir);

            dir = p5.Vector.sub(D, center);
            dir.rotate(-p.PI / 2);
            let B = p5.Vector.add(center, dir);

            this.customRoot = new Rectangle(A, B, C, D);
            this.customRoot.setColor(this.color);
            this.root = this.customRoot;
            this.rectangles = [this.root];
        }

        p.setCustomAngle = () => {
            let center = p5.Vector.lerp(this.root.A, this.root.B, 0.5);
            let heading = p.createVector(p.mouseX, p.mouseY);
            let commonPoint = p5.Vector.lerp(center, heading, this.root.size * 0.5 / p5.Vector.dist(heading, center));
            let dir = p5.Vector.sub(center, this.root.B);
            this.customAngle = dir.angleBetween(p5.Vector.sub(commonPoint, center));
            this.angle = this.customAngle;

            p.background(this.canvasColor);
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
    }

    _rollBack(p: any) {
        let to = 0;
        for(let i = 0; i <= +this.rollBackTo; i++) {
            to = to * 2 + 1;
        }

        if (this.rollBack) {
            if (this.play) {
                this.rollBack = false;
                let temp = this.rectangles.slice(0, to);
                this.rectangles = temp;
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
                for (let i = 0; i < (to - 1) / 2; i++) {
                    this.rectangles[i].draw(p);
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
        if (this.useFixedRoot) {
            this.root = this.fixedRoot;
        }
        else {
            this.root = this.customRoot;
        }
        if(this.root != null) {
            this.root.setColor(this.color);
        }
        if (this.useFixedAngle) {
            this.angle = this.fixedAngle;
        }
        else {
            this.angle = this.customAngle;
        }
        this.rectangles = [this.root];
        this.list = [];
        this.iter = 0;
        super.setStop();
    }

    setRectSize(obj: any, rectSize: number) {
        obj.rectSize = rectSize;
        obj.CONFIGURATIONS[3].bind.next(rectSize);
        obj.fixedRoot = new Rectangle(new p5.Vector(obj.width / 2 - obj.rectSize / 2, obj.height / 1.25 - obj.rectSize),
            new p5.Vector(obj.width / 2 + obj.rectSize / 2, obj.height / 1.25 - obj.rectSize),
            new p5.Vector(obj.width / 2 - obj.rectSize / 2, obj.height / 1.25),
            new p5.Vector(obj.width / 2 + obj.rectSize / 2, obj.height / 1.25));
        obj.fixedRoot.setColor(obj.color);

        obj.recalculateCustomRoot();

        if (obj.useFixedRoot) {
            obj.root = obj.fixedRoot;
        }
        else {
            obj.root = obj.customRoot;
        }
        if(!obj.play) {
            obj.rectangle = [obj.root];
        }
    }

    setFixedAngle(obj: any, value: boolean) {
        obj.useFixedAngle = value;
        obj.customAngle = null;
        obj.setStop();
    }
    
    setFixedRoot(obj: any, value: boolean) {
        obj.useFixedRoot = value;
        obj.customRoot = null;
        obj.rotation = 0;
        obj.setStop();
    }

    recalculateCustomRoot() {
        if (this.customRoot != null) {
            let center = p5.Vector.lerp(this.customRoot.A, this.customRoot.D, 0.5);
            let v1 = new p5.Vector(center.x + this.rectSize / 2, center.y + this.rectSize / 2);
            let dir = p5.Vector.sub(center, v1);

            dir.rotate(this.rotation);
            let A = p5.Vector.add(center, dir);

            dir = p5.Vector.sub(v1, center);
            dir.rotate(this.rotation);
            let D = p5.Vector.add(center, dir);

            dir = p5.Vector.sub(D, center);
            dir.rotate(Math.PI / 2);
            let C = p5.Vector.add(center, dir);

            dir = p5.Vector.sub(D, center);
            dir.rotate(-Math.PI / 2);
            let B = p5.Vector.add(center, dir);

            this.customRoot = new Rectangle(A, B, C, D);
            this.customRoot.setColor(this.color);
        }
    }

    setColor(obj: any, color: string): void {
        obj.color = color;
        obj.rainbowMode = false;
        obj.CONFIGURATIONS[5].bind.next(0);
        obj.setStop();
    }

    setRainbowMode(obj: any, value: boolean): void {
        obj.rainbowMode = value;
        obj.CONFIGURATIONS[5].bind.next(value);
        obj.setStop();
    }
    //#endregion
}

