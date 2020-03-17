import * as p5 from 'p5';

export class Line {
    public A: p5.Vector;
    public B: p5.Vector;
    public length: number;

    constructor(A: p5.Vector, B: p5.Vector) {
        this.A = A;
        this.B = B;
        this.length = p5.Vector.dist(this.A, this.B);
    }

    expandLeft(p: any, lerp: number) {
        let dir = p5.Vector.sub(this.A, this.B);
        dir.rotate(p.PI / 2);
        let xOffset = p5.Vector.add(this.A, dir)
        let x = p5.Vector.lerp(this.A, xOffset, lerp / 2);

        dir.rotate(-p.PI);
        let yOffset = p5.Vector.add(this.A, dir);
        let y = p5.Vector.lerp(this.A, yOffset, lerp / 2);

        return new Line(x, y);
    }

    expandRight(p: any, lerp: number): Line {
        let dir = p5.Vector.sub(this.B, this.A);
        dir.rotate(p.PI / 2);
        let xOffset = p5.Vector.add(this.B, dir);
        let x = p5.Vector.lerp(this.B, xOffset, lerp / 2);

        dir.rotate(-p.PI);
        let yOffset = p5.Vector.add(this.B, dir);
        let y = p5.Vector.lerp(this.B, yOffset, lerp / 2);

        return new Line(x, y);
    }

    draw(p: any) {
        p.line(this.A.x, this.A.y, this.B.x, this.B.y);
    }
}