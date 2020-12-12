import * as p5 from 'p5';

export class Rectangle {
    public A: p5.Vector;
    public B: p5.Vector;
    public C: p5.Vector;
    public D: p5.Vector;
    public size: number;
    public color: any;

    constructor(A, B, C, D) {
        this.A = A;
        this.B = B;
        this.C = C;
        this.D = D;
        this.size = p5.Vector.dist(this.A, this.B);
    }

    expandRight(p: any, angle: number): Rectangle {
        let A: p5.Vector;
        let B: p5.Vector;
        let C: p5.Vector;
        let D: p5.Vector = this.B;

        let center = p5.Vector.lerp(this.A, this.B, .5);
        let dir = p5.Vector.sub(this.A, center);
        dir.rotate(angle);
        let offset = p5.Vector.add(center, dir);

        C = p5.Vector.lerp(center, offset, this.size * 0.5 / p5.Vector.dist(offset, center));
               
        A = p5.Vector.sub(D, C);
        A.rotate(-p.PI/2);
        A = p5.Vector.add(C, A);
        A = p5.Vector.lerp(C, A, 1);

        B = p5.Vector.sub(C, D);
        B.rotate(p.PI/2);
        B = p5.Vector.add(D, B);
        B = p5.Vector.lerp(D, B, 1);

        let left = new Rectangle(A, B, C, D);
        
        return left;
    }

    expandLeft(p: any, angle: number): Rectangle {
        let A: p5.Vector;
        let B: p5.Vector;
        let C: p5.Vector = this.A;
        let D: p5.Vector;

        let center = p5.Vector.lerp(this.A, this.B, .5);
        let dir = p5.Vector.sub(this.A, center);
        dir.rotate(angle);
        let offset = p5.Vector.add(center, dir);

        D = p5.Vector.lerp(center, offset, this.size * 0.5 / p5.Vector.dist(offset, center));

        A = p5.Vector.sub(D, C);
        A.rotate(-p.PI/2);
        A = p5.Vector.add(C, A);
        A = p5.Vector.lerp(C, A, 1);

        B = p5.Vector.sub(C, D);
        B.rotate(p.PI/2);
        B = p5.Vector.add(D, B);
        B = p5.Vector.lerp(D, B, 1);

        let right = new Rectangle(A, B, C, D);

        return right;
    }

    setColor(color: any) {
        this.color = color;
    }

    draw(p: any) {
        p.fill(this.color);
        p.beginShape();
        p.vertex(this.A.x, this.A.y);
        p.vertex(this.B.x, this.B.y);
        p.vertex(this.D.x, this.D.y);
        p.vertex(this.C.x, this.C.y);
        p.vertex(this.A.x, this.A.y);
        p.endShape();
    }
}