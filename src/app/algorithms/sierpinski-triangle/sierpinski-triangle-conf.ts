import * as p5 from 'p5';
import { Point } from './point';
import { ConfigurableFractal } from '../fractal-configurable';
import { AnimationStateManagerService } from 'src/app/services/animation-state-manager.service';
import { IAlgorithmConfiguration } from 'src/app/models/algorithm-configuration';

export class SierpinskiTriangleConfigurable extends ConfigurableFractal {
    private fixedPoints: p5.Vector[];
    private customPoints: p5.Vector[];
    private fixedRefPoint: p5.Vector;
    private customRefPoint: p5.Vector;
    private points: p5.Vector[];
    private refPoint: p5.Vector;
    private useFixedPoints: boolean;
    private lerpValue: number;
    private customColors: boolean;
    private color1: string;
    private color2: string;
    private color3: string;
    private maxPoints: number;

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
            func: this.setRainbowMode
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
        
        this.fixedPoints.push(new p5.Vector(this.width / 2, 5));
        this.fixedPoints.push(new p5.Vector(5, this.height - 5));
        this.fixedPoints.push(new p5.Vector(this.width - 5, this.height - 5));
        this.fixedRefPoint = new p5.Vector(this.width / 2, this.height / 2);
        
        this.points = this.fixedPoints;
        this.refPoint = this.fixedRefPoint;
        
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
                    p.point(this.points[i].x, this.points[i].y);
                }
                if(this.refPoint != null) {
                    p.point(this.refPoint.x, this.refPoint.y);
                }
            }
            else if (this.play) {
                if (!this.useFixedPoints && (this.customPoints.length < 3 || this.customRefPoint == null)) {
                    p.background(this.canvasColor);
                    p.point(p.mouseX, p.mouseY);
                    for (let i = 0; i < this.customPoints.length; i++) {
                        p.point(this.customPoints[i].x, this.customPoints[i].y);
                    }
                }
                else {
                    let rand = p.floor(p.random(3));

                    if(this.rainbowMode) {
                        let h = p.map(p.floor(p.random(this.list.length)), 0, this.list.length, 0, 360);
                        p.stroke(h, 255, 255);
                    }
                    else if (this.customColors && rand == 0) p.stroke(this.color1);
                    else if (this.customColors && rand == 1) p.stroke(this.color2);
                    else if (this.customColors && rand == 2) p.stroke(this.color3);

                    let newPoint = p5.Vector.lerp(this.points[rand], this.refPoint, this.lerpValue);
                    p.point(newPoint.x, newPoint.y);
                    this.refPoint = newPoint;

                    this.rollBackList$.next(this.list);
                    this.list.push(new Point(newPoint));
                }
            }
        }

        p.handleMousePressed = () => {
            if (this.play && !this.useFixedPoints && this.customPoints.length < this.maxPoints + 1) {
                p.point(p.mouseX, p.mouseY);

                if (this.customPoints.length < this.maxPoints) {
                    this.customPoints.push(p.createVector(p.mouseX, p.mouseY));
                }
                else if (this.customPoints.length == this.maxPoints) {
                    this.customRefPoint = p.createVector(p.mouseX, p.mouseY);
                    this.points = this.customPoints;
                    this.refPoint = this.customRefPoint;
                }
            }
        }
    };

    setCustomColors(obj: SierpinskiTriangleConfigurable, value: boolean): void {
        obj.customColors = value;
        obj.setStop();
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
        super.setStop();
    }
}


