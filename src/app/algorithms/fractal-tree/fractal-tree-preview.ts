import * as p5 from 'p5';
import { Fractal } from '../fractal';
import { Line } from './line';

export class FractalTreePreview extends Fractal {
    private lines: Line[];
    private length: number;
    private root: Line;

    constructor() {
        super();
    }

    init(parentId: string, width: number, height: number, canvasColor: string) {
        super.init(parentId, width, height, canvasColor);
        this.length = this.height / 4;
        this.root = new Line(
            new p5.Vector(this.width / 2, this.height - this.length), 
            new p5.Vector(this.width / 2, this.height)
        );
        this.root.setColor(this.color);
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
            if(this.iter < 7) {
                let tempLines: Line[] = [];

                for(let i = 0; i < this.lines.length; i++) {
                    this.lines[i].setColor(this.color);
                    this.lines[i].draw(p);
                    tempLines = tempLines.concat(this.lines[i].branch(p, p.PI / 4, p.PI / 4, 0.7));
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



