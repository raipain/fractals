import * as p5 from 'p5';

export class Line {
    public A: p5.Vector;
    public B: p5.Vector;

    constructor(A: p5.Vector, B: p5.Vector) {
        this.A = A;
        this.B = B;
    }

    draw(p: any): void {
        p.line(this.A.x, this.A.y, this.B.x, this.B.y);
    }
}