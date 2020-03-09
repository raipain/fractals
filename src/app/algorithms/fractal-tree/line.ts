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

    branch(p: any, angle: number, lerpPercentage: number): Line[] {
        let lines: Line[] = [];
        let lerpAmount = this.length * lerpPercentage / this.length;
        
        let dir = p5.Vector.sub(this.A, this.B);
        let xRotated = dir.rotate(angle);
        let xOffset = p5.Vector.add(this.A, xRotated);
        let yRotated = dir.rotate(-2 * angle);
        let yOffset = p5.Vector.add(this.A, yRotated);
        let x = p5.Vector.lerp(this.A, xOffset, lerpAmount);
        let y = p5.Vector.lerp(this.A, yOffset, lerpAmount);

        lines.push(new Line(x, this.A));
        lines.push(new Line(y, this.A));

        return lines;
    }

    draw(p: any): void {
        p.line(this.A.x, this.A.y, this.B.x, this.B.y);
    }
}