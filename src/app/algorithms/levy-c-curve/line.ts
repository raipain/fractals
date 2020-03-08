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

    expand(p: any, direction: number, angle: number): Line[] {
        let alpha = 180 - 2 * p.degrees(angle);
        let sideLength = this.length * p.sin(angle) / p.sin(p.radians(alpha));

        let dir = p5.Vector.sub(this.B, this.A);
        dir.rotate(direction * angle);
        let offset = p5.Vector.add(this.A, dir);
        let adjOffset = p5.Vector.lerp(this.A, offset, sideLength / p5.Vector.dist(this.A, offset));

        let lines = [];
        lines.push(new Line(this.A, adjOffset));
        lines.push(new Line(adjOffset, this.B));

        return lines;
    }

    draw(p: any) {
        p.line(this.A.x, this.A.y, this.B.x, this.B.y);
    }
}