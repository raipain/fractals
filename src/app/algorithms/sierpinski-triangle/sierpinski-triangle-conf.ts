import * as p5 from 'p5';
import { Point } from './point';
import { ConfigurableFractal } from '../fractal-configurable';
import { AnimationStateManagerService } from 'src/app/services/animation-state-manager.service';
import { IAlgorithmConfiguration } from 'src/app/models/algorithm-configuration';
import { BehaviorSubject } from 'rxjs';

export class SierpinskiTriangleConfigurable extends ConfigurableFractal {
    private fixedPoints: Point[];
    private customPoints: Point[];
    private fixedRefPoint: Point;
    private customRefPoint: Point;
    private points: Point[];
    private refPoint: Point;
    private useFixedPoints: boolean;
    private lerpValue: number;
    private customColors: boolean;
    private color1: string;
    private color2: string;
    private color3: string;
    private maxPoints: number;
    private randomStrokeWeight: boolean;

    readonly CONFIGURATIONS: IAlgorithmConfiguration[] = [
        {
            name: "Gyorsaság",
            type: "slider",
            value: 60,
            minValue: 1,
            maxValue: 60,
            step: 1,
            func: this.setFrameRate
        },
        {
            name: "Pontvastagság",
            type: "slider",
            value: 3,
            minValue: 1,
            maxValue: 10,
            step: 1,
            func: this.setStrokeWeight
        },
        {
            name: "Véletlenszerű pontvastagság",
            type: "checkbox",
            value: 0,
            func: this.setRandomStrokeWeight
        },
        {
            name: "Pontok közötti távolság",
            type: "slider",
            value: 0.5,
            minValue: 0.1,
            maxValue: 1,
            step: 0.1,
            func: this.setLerpValue
        },
        {
            name: "Fixált kezdőpontok",
            type: "checkbox",
            value: 1,
            func: this.setUseFixedPoints
        },
        {
            name: "Háromszög részeinek kijelölése",
            type: "checkbox-tree",
            value: 0,
            func: this.setCustomColors,
            bind: new BehaviorSubject<number>(0),
            configurations: [
                {
                    name: "Szín 1",
                    type: "colorpicker",
                    color: "#000",
                    func: this.setColor1
                },
                {
                    name: "Szín 2",
                    type: "colorpicker",
                    color: "#000",
                    func: this.setColor2
                },
                {
                    name: "Szín 3",
                    type: "colorpicker",
                    color: "#000",
                    func: this.setColor3
                }
            ]
        },
        {
            name: "Szín",
            type: "colorpicker",
            color: "#000",
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
        this.maxPoints = 3;
    }
    
    init(parentId: string, width: number, height: number, canvasColor: string) {
        super.init(parentId, width, height, canvasColor);
        
        this.useFixedPoints = true;
        this.strokeWeight = 3;
        this.frameRate = 60;
        this.lerpValue = 0.5;
        this.fixedPoints = [];
        this.customPoints = [];
        this.customRefPoint = null;
        this.customColors = false;
        this.color1 = "#000000";
        this.color2 = "#000000";
        this.color3 = "#000000";
        this.randomStrokeWeight = false;
        
        this.fixedPoints.push(new Point(new p5.Vector(this.width / 2, 5)));
        this.fixedPoints.push(new Point(new p5.Vector(5, this.height - 5)));
        this.fixedPoints.push(new Point(new p5.Vector(this.width - 5, this.height - 5)));
        this.fixedRefPoint = new Point(new p5.Vector(this.width / 2, this.height / 2));
        this.fixedRefPoint.setColor("#000");
        this.fixedPoints[0].setColor("#000");
        this.fixedPoints[1].setColor("#000");
        this.fixedPoints[2].setColor("#000");
        
        this.points = this.fixedPoints;
        this.refPoint = this.fixedRefPoint;

        this.points.forEach(point => { this.list.push(point) });
        this.list.push(this.refPoint);
        this.rollBackList$.next(this.list);
        
        this.createCanvas();
    }

    sketch(p: any) {
        p.setup = () => {
            this.canvas = p.createCanvas(this.width, this.height);
            this.canvas.parent(this.parentId);
            this.canvas.mousePressed(p.handleMousePressed);

            p.colorMode(p.HSB, 360, 255, 255);
            p.background(this.canvasColor);
            p.stroke(this.color);
            p.strokeWeight(this.strokeWeight);
            p.frameRate(this.frameRate);
        };

        p.draw = () => {
            this.setConfigurables(p);

            if (this.rollBack) {
                this._rollBack(p);
            }
            else if (this.stop) {
                p.background(this.canvasColor);
                for (let i = 0; i < this.points.length; i++) {
                    p.point(this.points[i].point.x, this.points[i].point.y);
                }
                if(this.refPoint != null) {
                    p.point(this.refPoint.point.x, this.refPoint.point.y);
                }
            }
            else if (this.play) {
                if (!this.useFixedPoints && (this.customPoints.length < 3 || this.customRefPoint == null)) {
                    p.background(this.canvasColor);
                    p.point(p.mouseX, p.mouseY);
                    for (let i = 0; i < this.customPoints.length; i++) {
                        p.point(this.customPoints[i].point.x, this.customPoints[i].point.y);
                    }
                }
                else {
                    let rand = p.floor(p.random(3));
                    if(this.randomStrokeWeight) {
                        p.strokeWeight(p.random(0, 10));
                    }

                    if(this.rainbowMode) {
                        let h = p.map(p.floor(p.random(this.list.length)), 0, this.list.length, 0, 360);
                        this.color = p.color(h, 255, 255);
                    }
                    else if (this.customColors && rand == 0) this.color = this.color1;
                    else if (this.customColors && rand == 1) this.color = this.color2;
                    else if (this.customColors && rand == 2) this.color = this.color3;
   
                    let newPoint = new Point(p5.Vector.lerp(this.points[rand].point, this.refPoint.point, this.lerpValue));
                    newPoint.setColor(this.color);
                    newPoint.draw(p);
                    this.refPoint = newPoint;
                    
                    this.list.push(newPoint);
                    this.rollBackList$.next(this.list);
                }
            }
        }

        p.handleMousePressed = () => {
            if (this.play && !this.useFixedPoints && this.customPoints.length < this.maxPoints + 1) {
                p.point(p.mouseX, p.mouseY);

                if (this.customPoints.length < this.maxPoints) {
                    this.customPoints.push(new Point(p.createVector(p.mouseX, p.mouseY)));
                    this.customPoints[this.customPoints.length - 1].setColor(this.color);
                }
                else if (this.customPoints.length == this.maxPoints) {
                    this.customRefPoint = new Point(p.createVector(p.mouseX, p.mouseY));
                    this.customRefPoint.setColor(this.color);
                    this.points = this.customPoints;
                    this.refPoint = this.customRefPoint;

                    this.list = [];

                    this.points.forEach(point => { this.list.push(point) });
                    this.list.push(this.refPoint);
                    this.rollBackList$.next(this.list);
                }
            }
        }
    };

    _rollBack(p: any) {
        if (this.rollBack) {
            if (this.play) {
                this.rollBack = false;
                let temp = this.list.slice(0, this.rollBackTo);
                this.list = temp;
                if(this.useFixedPoints) {
                    this.fixedPoints.forEach(x => x.draw(p));
                    this.fixedRefPoint.draw(p);
                }
                else {
                    this.customPoints.forEach(x => x.draw(p));
                    this.customRefPoint.draw(p);
                }
            }
            else {
                p.background(this.canvasColor);
                for (let i = 0; i < this.rollBackTo; i++) {
                    this.list[i].draw(p);
                }
            }
        }
    }

    setColor(obj: any, color: string): void {
        obj.color = color;
        obj.rainbowMode = false;
        obj.CONFIGURATIONS[5].bind.next(0);
        obj.CONFIGURATIONS[7].bind.next(0);
        obj.setStop();
    }

    setRainbowMode(obj: any, value: boolean): void {
        obj.rainbowMode = value;
        obj.CONFIGURATIONS[7].bind.next(value);
        obj.CONFIGURATIONS[5].bind.next(0);
        obj.setStop();
    }

    setCustomColors(obj: SierpinskiTriangleConfigurable, value: boolean): void {
        obj.customColors = value;
        obj.CONFIGURATIONS[5].bind.next(value);
        if(value) {
            obj.CONFIGURATIONS[7].bind.next(0);
        }
        obj.setStop();
        obj.rainbowMode = false;
        
    }

    setColor1(obj: SierpinskiTriangleConfigurable, color: string): void {
        obj.color1 = color;
        obj.setStop();
    }

    setColor2(obj: SierpinskiTriangleConfigurable, color: string): void {
        obj.color2 = color;
        obj.setStop();
    }

    setColor3(obj: SierpinskiTriangleConfigurable, color: string): void {
        obj.color3 = color;
        obj.setStop();
    }

    setLerpValue(obj: SierpinskiTriangleConfigurable, value: number): void {
        obj.lerpValue = value;
        obj.setStop();
    }

    setUseFixedPoints(obj: SierpinskiTriangleConfigurable, value: boolean): void {
        obj.useFixedPoints = value;
        obj.customRefPoint = null;
        obj.customPoints = [];
        obj.setStop();
    }

    setRandomStrokeWeight(obj: SierpinskiTriangleConfigurable, value: boolean): void {
        obj.randomStrokeWeight = value;
        obj.setStop();
    }

    setConfigurables(p: any): void {
        p.frameRate(this.frameRate);
        p.stroke(this.color);
        p.strokeWeight(this.strokeWeight);
    }

    setStop(): void {
        this.list = [];
        if (this.useFixedPoints) {
            this.points = this.fixedPoints;
            this.refPoint = this.fixedRefPoint;
        }
        else {
            this.refPoint = this.customRefPoint;
            this.points = this.customPoints;
        }

        this.points.forEach(point => { this.list.push(point) });
        this.list.push(this.refPoint);
        super.setStop();
    }

    getRainbowMode() {
        return this.rainbowMode;
    }
}


