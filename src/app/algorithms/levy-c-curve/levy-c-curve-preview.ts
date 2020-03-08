import * as p5 from 'p5';
import { Fractal } from '../fractal';
import { Line } from './line';

export class LevyCCurvePreview extends Fractal {
    private lines: Line[];
    private root: Line;
    private length: number;

    constructor() {
        super();
    }

    init(parentId: string, width: number, height: number, canvasColor: string) {
        super.init(parentId, width, height, canvasColor);
        this.length = this.width / 2;
        
        this.root = new Line(
            new p5.Vector(this.width / 2 - this.length / 2, this.height / 1.5), 
            new p5.Vector(this.width / 2 + this.length / 2, this.height / 1.5)
        );
        this.lines = [this.root];

        this.createCanvas();
    }

    sketch(p: any) {
        p.setup = () => {
            this.canvas = p.createCanvas(this.width, this.height);
            this.canvas.parent(this.parentId);

            p.background(this.canvasColor);
            p.frameRate(this.frameRate);
        }

        p.draw = () => {
            p.background(this.canvasColor);
            if(this.iter < 10) {
                let tempLines: Line[] = [];
                for(let i = 0; i < this.lines.length; i++) {
                    this.lines[i].draw(p);
                    tempLines = tempLines.concat(this.lines[i].expand(p, -1, p.PI / 4));
                }

                this.lines = tempLines;
                this.iter++;
            }
            else {
                this.lines = [this.root];
                this.iter = 0;
                p.setup();
            }
        }
    }
}
