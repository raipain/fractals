import * as p5 from 'p5';

export class Line {
    public A;
    public B;

    constructor(A, B) {
        this.A = A;
        this.B = B;
    }

    expandLeft(p: any) {
        let distance = p5.Vector.dist(this.A, this.B);
        let lerpAmount = ((distance / Math.sqrt(2)) / distance) / 2;

        let dir = p5.Vector.sub(this.A, this.B);
        dir.rotate(p.PI / 2);
        let xOffset = p5.Vector.add(this.A, dir)
        let x = p5.Vector.lerp(this.A, xOffset, lerpAmount);

        dir.rotate(-p.PI);
        let yOffset = p5.Vector.add(this.A, dir);
        let y = p5.Vector.lerp(this.A, yOffset, lerpAmount);

        return new Line(x, y);
    }

    expandRight(p: any): Line {
        let distance = p5.Vector.dist(this.A, this.B);
        let lerpAmount = ((distance / Math.sqrt(2)) / distance) / 2;

        let dir = p5.Vector.sub(this.B, this.A);
        dir.rotate(p.PI / 2);
        let xOffset = p5.Vector.add(this.B, dir);
        let x = p5.Vector.lerp(this.B, xOffset, lerpAmount);

        dir.rotate(-p.PI);
        let yOffset = p5.Vector.add(this.B, dir);
        let y = p5.Vector.lerp(this.B, yOffset, lerpAmount);

        return new Line(x, y);
    }

    draw(p: any) {
        p.line(this.A.x, this.A.y, this.B.x, this.B.y);
    }
}