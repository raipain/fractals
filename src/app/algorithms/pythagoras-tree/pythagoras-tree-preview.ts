import * as p5 from 'p5';
import { Fractal } from '../fractal';
import { Rectangle } from './rectangle';

export class PythagorasTreePreview extends Fractal {
    private rectangles: Rectangle[];
    private root: Rectangle;
    private rectSize: number;

    constructor() {
        super();
        this.rectSize = 25;
    }

    init(parentId: string, width: number, height: number, canvasColor: string) {
        super.init(parentId, width, height, canvasColor);

        this.root = new Rectangle(new p5.Vector(this.width / 2 - this.rectSize / 2, this.height / 1.25 - this.rectSize), 
                                    new p5.Vector(this.width / 2 + this.rectSize / 2, this.height / 1.25 - this.rectSize),
                                    new p5.Vector(this.width / 2 - this.rectSize / 2, this.height / 1.25),
                                    new p5.Vector(this.width / 2 + this.rectSize / 2, this.height / 1.25));
        this.rectangles = [this.root];

        this.createCanvas();
    }

    sketch(p: any) {
        p.setup = () => {
            this.canvas = p.createCanvas(this.width, this.height);
            this.canvas.parent(this.parentId);

            p.background(this.canvasColor);
            p.noStroke();
            p.fill(this.color);
            p.frameRate(this.frameRate);
        }

        p.draw = () => {
            if(this.iter < 6) {
                let newRects: Rectangle[] = [];
                for(let i = 0; i < this.rectangles.length; i++) {
                    this.rectangles[i].draw(p);
                    let left = this.rectangles[i].expandLeft(p, p.PI / 2);
                    let right = this.rectangles[i].expandRight(p, p.PI / 2);
                    newRects.push(left);
                    newRects.push(right);
                }

                this.iter++;
                this.rectangles = newRects;
            }
            else {
                this.rectangles = [this.root];
                this.iter = 0;
                p.setup();
            }
        }
    }
}

