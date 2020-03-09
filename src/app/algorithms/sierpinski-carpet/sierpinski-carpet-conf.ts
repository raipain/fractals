import * as p5 from 'p5';
import { ConfigurableFractal } from '../fractal-configurable';
import { AnimationStateManagerService } from 'src/app/services/animation-state-manager.service';
import { Rectangle } from './rectangle';

export class SierpinskiCarpetConfigurable extends ConfigurableFractal  {
    private root: Rectangle;

    constructor(animationStateManagerService: AnimationStateManagerService) {
        super(animationStateManagerService);
    }

    init(parentId: string, width: number, height: number, canvasColor: string) {
        super.init(parentId, width, height, canvasColor);
        this.root = new Rectangle(new p5.Vector(this.width / 2, this.height / 2), Math.min(this.width, this.height) / 3);
        this.list = [this.root];
        this.rollBackList$.next(this.list);

        this.createCanvas();
    }

    sketch(p: any) {
        p.setup = () => {
            this.canvas = p.createCanvas(this.width, this.height);
            this.canvas.parent(this.parentId);

            p.rectMode(p.CENTER);
            p.fill(this.color);
            p.noStroke();
            p.frameRate(this.frameRate);
        }

        p.draw = () => {
            this.setConfigurables(p);

            if(this.rollBack) {
                this._rollBack(p);
            }
            else if(this.stop) {
                p.setup();
            }
            else if(this.play) {
                let newRectangles: Rectangle[] = [];
                for(let i = this.iter; i < this.list.length; i++) {
                    this.list[i].draw(p);
                    newRectangles = newRectangles.concat(this.list[i].divide());
                }

                this.rollBackList$.next(this.list);
                this.iter = this.list.length;
                this.list = this.list.concat(newRectangles);
            }
        }
    }

    setConfigurables(p: any) {
        p.frameRate(this.frameRate);
        p.fill(this.color);
    }

    setStop() {
        this.list = [this.root];
        super.setStop();
    }

    setRectSize(obj: any, rectSize: number): void {
        obj.rectSize = rectSize;
        obj.setStop();
    }
}
