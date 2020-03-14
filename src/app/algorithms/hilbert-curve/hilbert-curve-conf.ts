import * as p5 from 'p5';
import { ConfigurableFractal } from '../fractal-configurable';
import { AnimationStateManagerService } from 'src/app/services/animation-state-manager.service';
import { Line } from './line';
import { IAlgorithmConfiguration } from 'src/app/models/algorithm-configurations';

export class HilbertCurveConfigurable extends ConfigurableFractal {
    private order: number;
    private squares: number;
    private points: number;
    private counter: number;
    private length: number;
    private path: Array<any>;

    readonly CONFIGURATIONS: IAlgorithmConfiguration[] = [
        {
            name: "Gyorsaság",
            type: "slider",
            value: 20,
            minValue: 1,
            maxValue: 60,
            step: 1,
            func: this.setFrameRate
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
            name: "Iteráció",
            type: "slider",
            value: 5,
            minValue: 1,
            maxValue: 20,
            step: 1,
            func: this.setOrder
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

        this.order = 5;
        this.frameRate = 20;
        this.counter = 2;
        this.path = [];
        this.setup();

        this.createCanvas();
    }
    
    sketch(p: any): void {
        p.setup = () => {
            this.canvas = p.createCanvas(this.width, this.height);
            this.canvas.parent(this.parentId);
            /*p.colorMode(p.HSB, 360, 255, 255);*/
            p.background(this.canvasColor);
            p.frameRate(this.frameRate);
        }

        p.draw = () => {
            this.setConfigurables(p);

            if(this.rollBack) {
                this._rollBack(p);
            }
            else if(this.play) {
                for (let i = this.counter - 1; i < this.counter; i++) {
                    if(i < this.path.length) {
                        let line = new Line(
                            new p5.Vector(this.path[i].x, this.path[i].y), 
                            new p5.Vector(this.path[i - 1].x, this.path[i - 1].y)
                        );
                        this.list.push(line);
                        this.rollBackList$.next(this.list);
                        line.draw(p);
                    }
                    /*let h = p.map(i, 0, this.path.length, 0, 360);
                    p.stroke(h, 255, 255);*/
                }
    
                this.counter += 1;
                if (this.counter > this.path.length) {
                    this.play = false;
                }
            }
        }
    }

    setup(): void {
        this.squares = Math.pow(2, this.order);
        this.points = Math.pow(this.squares, 2);
        this.length = Math.min(this.width, this.height) / this.squares;
        for (let i = 0; i < this.points; i++) {
            this.path[i] = this.hilbert(i);
            this.path[i].mult(this.length);
            this.path[i].add(this.length / 2, this.length / 2);
        }
    }

    hilbert(i: number): p5.Vector {
        const points = [
            new p5.Vector(0, 0),
            new p5.Vector(0, 1),
            new p5.Vector(1, 1),
            new p5.Vector(1, 0)
        ];

        let index = i & 3;
        let v = points[index];

        for (let j = 1; j < this.order; j++) {
            i = i >>> 2;
            index = i & 3;
            let len = Math.pow(2, j);
            if (index == 0) {
                let temp = v.x;
                v.x = v.y;
                v.y = temp;
            } else if (index == 1) {
                v.y += len;
            } else if (index == 2) {
                v.x += len;
                v.y += len;
            } else if (index == 3) {
                let temp = len - 1 - v.x;
                v.x = len - 1 - v.y;
                v.y = temp;
                v.x += len;
            }
        }
        return v;
    }

    setConfigurables(p: any): void {
        p.frameRate(this.frameRate);
        p.stroke(this.color);
        p.strokeWeight(this.strokeWeight);
    }
    
    setStop(): void {
        this.counter = 2;
        this.path = [];
        this.setup();
        this.list = []; 
        super.setStop();
    }

    setOrder(obj: any, order: number): void {
        obj.order = order;
        obj.setStop();
    }
}