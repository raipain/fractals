import * as p5 from 'p5';
import { Fractal } from '../fractal';
import { Line } from './line';

export class HTreePreview extends Fractal {
    private lines: Line[];
    private length: number;
    private root: Line;
    private lerp: number;

    constructor() {
        super();
    }
    
    init(parentId: string, width: number, height: number, canvasColor: string) {
        super.init(parentId, width, height, canvasColor);
        
        this.length = this.width / 3;
        this.root = new Line(
            new p5.Vector(this.width / 2 - this.length / 2, this.height / 2), 
            new p5.Vector(this.width / 2 + this.length / 2, this.height / 2)
        );
        this.root.setColor(this.color);
        this.lines = [this.root];
        this.lerp =  (this.length / Math.sqrt(2)) / this.length;

        this.createCanvas();
    }

    createCanvas() {
        this.p5 = new p5(this.sketch);
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
                    
                    let left = this.lines[i].expandLeft(p, this.lerp);
                    let right = this.lines[i].expandRight(p, this.lerp);
                    
                    tempLines.push(left);
                    tempLines.push(right);
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