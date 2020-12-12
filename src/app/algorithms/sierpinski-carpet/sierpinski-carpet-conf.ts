import * as p5 from 'p5';
import { ConfigurableFractal } from '../fractal-configurable';
import { AnimationStateManagerService } from 'src/app/services/animation-state-manager.service';
import { IAlgorithmConfiguration } from 'src/app/models/algorithm-configuration';
import { Rectangle } from './rectangle';
import { BehaviorSubject } from 'rxjs';

export class SierpinskiCarpetConfigurable extends ConfigurableFractal {
    private root: Rectangle;
    private rectSize: number;
    private rectangles: Rectangle[];

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
            name: "Négyzet mérete",
            type: "slider",
            value: 100,
            minValue: 100,
            maxValue: 400,
            step: 1,
            func: this.setRectSize,
            bind: new BehaviorSubject<number>(100)
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

    init(parentId: string, width: number, height: number, canvasColor: string): void {
        super.init(parentId, width, height, canvasColor);

        this.rectSize = Math.min(this.width, this.height) / 3;
        this.CONFIGURATIONS[1].bind.next(this.rectSize);
        this.root = new Rectangle(new p5.Vector(this.width / 2, this.height / 2), this.rectSize);
        this.root.setColor(this.color);

        this.rectangles = [this.root];

        this.createCanvas();
    }

    sketch(p: any) {
        p.setup = () => {
            this.canvas = p.createCanvas(this.width, this.height);
            this.canvas.parent(this.parentId);

            p.colorMode(p.HSB, 360, 255, 255);
            p.frameRate(this.frameRate);
            p.rectMode(p.CENTER);
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
                this.root.draw(p);
            }
            else if (this.play) {
                let newRectangles: Rectangle[] = [];

                for (let i = this.iter; i < this.rectangles.length; i++) {
                    this.rectangles[i].setColor(this.color);
                    if(this.rainbowMode) {
                        let h = p.map(i, this.iter, this.rectangles.length, 0, 360);
                        this.rectangles[i].setColor(p.color(h, 255, 255));
                    }
                    this.rectangles[i].draw(p);
                    newRectangles = newRectangles.concat(this.rectangles[i].divide());
                }

                this.list.push(this.rectangles.length);
                this.rollBackList$.next(this.list);
                this.iter = this.rectangles.length;
                this.rectangles = this.rectangles.concat(newRectangles);
            }
        }
    }

    _rollBack(p: any) {
        let to = 0;
        for(let i = 0; i <= +this.rollBackTo; i++) {
            to = to * 8 + 1;
        }

        if (this.rollBack) {
            if (this.play) {
                this.rollBack = false;
                let temp = this.rectangles.slice(0, to);
                this.rectangles = temp;
                this.iter = (to - 1) / 8;
                temp = this.list.slice(0, this.rollBackTo);
                this.list = temp;
            }
            else {
                p.background(this.canvasColor);
                for (let i = 0; i < (to - 1) / 8; i++) {
                    this.rectangles[i].draw(p);
                }
            }
        }
    }

    setConfigurables(p: any): void {
        p.frameRate(this.frameRate);
        p.fill(this.color);
    }

    setStop(): void {
        this.root = new Rectangle(new p5.Vector(this.width / 2, this.height / 2), this.rectSize);
        this.root.setColor(this.color);
        this.rectangles = [this.root];
        this.list = [];
        this.iter = 0;
        super.setStop();
    }

    setRectSize(obj: SierpinskiCarpetConfigurable, rectSize: number): void {
        obj.CONFIGURATIONS[1].bind.next(rectSize);
        obj.rectSize = rectSize;
        obj.setStop();
    }

    setColor(obj: any, color: string): void {
        obj.color = color;
        obj.rainbowMode = false;
        obj.CONFIGURATIONS[3].bind.next(0);
        obj.setStop();
    }

    setRainbowMode(obj: any, value: boolean): void {
        obj.rainbowMode = value;
        obj.CONFIGURATIONS[3].bind.next(value);
        obj.setStop();
    }
}
