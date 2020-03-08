import * as p5 from 'p5';
import { Fractal } from '../fractal';
import { Line } from './line';

export class KochCurvePreview extends Fractal {
    private lines: Line[];
    private length: number;
    private root: Line;

    constructor() {
        super();
    }

    init(parentId: string, width: number, height: number, canvasColor: string) {
        super.init(parentId, width, height, canvasColor);
        
        this.length = this.width / 1.5;
        this.root = new Line(new p5.Vector(this.width / 2 - this.length / 2, this.height / 2), 
                            new p5.Vector(this.width /2 + this.length / 2, this.height / 2));

        this.lines = [this.root];

        this.createCanvas();
    }

    sketch(p: any) {
        p.setup = () => {
            this.canvas = p.createCanvas(this.width, this.height);
            this.canvas.parent(this.parentId);
            
            p.frameRate(this.frameRate);
            p.background(this.canvasColor);
            p.stroke(this.color);
        }
        
        p.draw = () => {
            p.background(this.canvasColor);
            if(this.iter < 7) {
                let newLines = [];
                for(let i = 0; i < this.lines.length; i++) {
                    this.lines[i].draw(p);
                    
                    let left = this.lines[i].expandLeft(p, -1, p.radians(65));
                    let right = this.lines[i].expandRight(p, -1, p.radians(65));
                    newLines = newLines.concat(left, right);
                }

                this.lines = newLines; 
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