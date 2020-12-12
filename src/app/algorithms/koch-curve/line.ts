import * as p5 from 'p5';

export class Line {
    public A;
    public B;
    public length;
    public color: any = "#000";

    constructor(A, B) {
        this.A = A;
        this.B = B;
        this.length = p5.Vector.dist(this.A, this.B);
    }

    expandLeft(p: any, direction: number, lerp: number, angle: number): Line[] {
        let len = this.length * lerp;
        let alpha = 180 - 2 * p.degrees(angle);
        let sideLength = len * p.sin(angle) / p.sin(p.radians(alpha));

        let lerpAmount = (1 - lerp) / 2;

        let a = p5.Vector.lerp(this.A, this.B, lerpAmount);
        let dir = p5.Vector.sub(this.B, this.A);
        dir.rotate(-direction * angle);
        let offset = p5.Vector.add(a, dir);
        
        let x = p5.Vector.lerp(a, offset, sideLength / p5.Vector.dist(a, offset));

        let newLines = [];
        newLines.push(new Line(this.A, a));
        newLines.push(new Line(a, x));

        return newLines;
    }

    expandRight(p: any, direction: number, lerp: number, angle: number): Line[] {
        let len = this.length * lerp;
        let alpha = 180 - 2 * p.degrees(angle);
        let sideLength = len * p.sin(angle) / p.sin(p.radians(alpha));

        let lerpAmount = (1 - lerp) / 2;

        let b = p5.Vector.lerp(this.B, this.A, lerpAmount);
        let dir = p5.Vector.sub(this.A, this.B);
        dir.rotate(direction * angle);
        let x = p5.Vector.add(b, dir);
        
        let offset = p5.Vector.lerp(b, x, sideLength / p5.Vector.dist(b, x));

        let newLines = [];
        newLines.push(new Line(offset, b));
        newLines.push(new Line(b, this.B));

        return newLines;
    }

    setColor(color: any) {
        this.color = color;
    }

    draw(p: any): void {
        p.stroke(this.color);
        p.line(this.A.x, this.A.y, this.B.x, this.B.y);
    }
}