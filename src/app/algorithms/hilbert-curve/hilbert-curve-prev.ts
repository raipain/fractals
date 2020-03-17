import * as p5 from 'p5';
import { Fractal } from '../fractal';

export class HilbertCurvePreview extends Fractal {
    private order: number;
    private squares: number;
    private points: number;
    private path: Array<any>;
    private counter: number;
    private length: number;

    constructor() {
        super();
    }

    init(parentId: string, width: number, height: number, canvasColor: string): void {
        super.init(parentId, width, height, canvasColor);

        this.frameRate = 15;
        this.order = 3;
        this.counter = 2;
        this.squares = Math.pow(2, this.order);
        this.points = Math.pow(this.squares, 2);
        this.length = Math.min(this.width, this.height) / this.squares;
        this.path = [];
        this.setup();

        this.createCanvas();
    }

    sketch(p: any): void {
        p.setup = () => {
            this.canvas = p.createCanvas(this.width, this.height);
            this.canvas.parent(this.parentId);

            p.stroke(0);
            p.strokeWeight(1);
            p.background(this.canvasColor);
            p.frameRate(this.frameRate);
        }

        p.draw = () => {
            for (let i = this.counter - 1; i < this.counter; i++) {
                if (i < this.path.length) {
                    p.line(this.path[i].x, this.path[i].y, this.path[i - 1].x, this.path[i - 1].y);
                }
            }

            this.counter += 1;
            if (this.counter > this.path.length) {
                this.counter = 2;
                p.background(this.canvasColor);
            }
        }
    }

    setup(): void {
        for (let i = 0; i < this.points; i++) {
            this.path[i] = this.hilbert(i);
            this.path[i].mult(this.length);
            this.path[i].add(this.length / 2, this.length / 2);
        }
    }

    hilbert(i: number): p5.Vector {
        const points: p5.Vector[] = [
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

}