import * as p5 from 'p5';
import { ConfigurableFractal } from '../fractal-configurable';
import { AnimationStateManagerService } from 'src/app/services/animation-state-manager.service';
import { IAlgorithmConfiguration } from 'src/app/models/algorithm-configuration';
import { Rectangle } from './rectangle';

export class SierpinskiCarpetConfigurable extends ConfigurableFractal {
    private root: Rectangle;
    private rectSize: number;

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
            name: "Négyzet mérete",
            type: "slider",
            value: 100,
            minValue: 100,
            maxValue: 600,
            step: 1,
            func: this.setRectSize
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
    }

    init(parentId: string, width: number, height: number, canvasColor: string): void {
        super.init(parentId, width, height, canvasColor);

        this.rectSize = Math.min(this.width, this.height) / 3;
        this.root = new Rectangle(new p5.Vector(this.width / 2, this.height / 2), this.rectSize);

        this.list = [this.root];
        this.rollBackList$.next(this.list);

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
                console.log(1323)
                let newRectangles: Rectangle[] = [];

                for (let i = this.iter; i < this.list.length; i++) {
                    if(this.rainbowMode) {
                        let h = p.map(i, this.iter, this.list.length, 0, 360);
                        p.fill(h, 255, 255);
                    }
                    this.list[i].draw(p);
                    newRectangles = newRectangles.concat(this.list[i].divide());
                }

                this.rollBackList$.next(this.list);
                this.iter = this.list.length;
                this.list = this.list.concat(newRectangles);
            }
        }
    }

    setConfigurables(p: any): void {
        p.frameRate(this.frameRate);
        p.fill(this.color);
    }

    setStop(): void {
        this.root = new Rectangle(new p5.Vector(this.width / 2, this.height / 2), this.rectSize);
        this.list = [this.root];
        this.iter = 0;
        super.setStop();
    }

    setRectSize(obj: SierpinskiCarpetConfigurable, rectSize: number): void {
        obj.rectSize = rectSize;
        obj.setStop();
    }
}
