import * as p5 from 'p5';

export class Rectangle {
    public A: p5.Vector;
    public B: p5.Vector;
    public C: p5.Vector;
    public D: p5.Vector;
    public commonPointOfChildren: p5.Vector;
    public size;

    constructor(A, B, C, D) {
        this.size = p5.Vector.dist(A, B);
        this.A = A;
        this.B = B;
        this.C = C;
        this.D = D;
    }

    setCommonPointOfChildren(commonPoint: p5.Vector): void {
        this.commonPointOfChildren = commonPoint;
    }

    expandRight(p: any): Rectangle {
        let A: p5.Vector;
        let B: p5.Vector;
        let C: p5.Vector;
        let D: p5.Vector = this.B;
        
        if(this.commonPointOfChildren != null) {
            C = this.commonPointOfChildren;
        }
        else {
            let width = Math.sqrt((this.size * this.size) / 2);
            let lerp = width / this.size;

            C = p5.Vector.sub(this.A, this.B);
            C.rotate(p.PI/4);
            C = p5.Vector.add(this.B, C);
            C = p5.Vector.lerp(this.B, C, lerp);
        }
        
        A = p5.Vector.sub(D, C);
        A.rotate(-p.PI/2);
        A = p5.Vector.add(C, A);
        A = p5.Vector.lerp(C, A, 1);

        B = p5.Vector.sub(C, D);
        B.rotate(p.PI/2);
        B = p5.Vector.add(D, B);
        B = p5.Vector.lerp(D, B, 1);

        let left = new Rectangle(A, B, C, D);
        
        if(this.commonPointOfChildren != null) {
            let center = p5.Vector.lerp(left.A, left.B, 0.5);
            let heading = p5.Vector.sub(center, left.B);
            let rootCenter = p5.Vector.lerp(this.A, this.B, 0.5);
            let rootHeading = p5.Vector.sub(rootCenter, this.B);
            let angle = rootHeading.angleBetween(p5.Vector.sub(this.commonPointOfChildren, rootCenter));
    
            heading.rotate(angle);
            heading = p5.Vector.add(center, heading);
            let commonPoint = p5.Vector.lerp(center, heading, left.size * 0.5 / p5.Vector.dist(heading, center));
    
            left.setCommonPointOfChildren(commonPoint);
        }

        return left;
    }

    expandLeft(p: any): Rectangle {
        let A: p5.Vector;
        let B: p5.Vector;
        let C: p5.Vector = this.A;
        let D: p5.Vector;

        if(this.commonPointOfChildren != null) {
            D = this.commonPointOfChildren;
        }
        else {
            let width = Math.sqrt((this.size * this.size) / 2);
            let lerp = width / this.size;

            D = p5.Vector.sub(this.B, this.A);
            D.rotate(-p.PI/4);
            D = p5.Vector.add(this.A, D);
            D = p5.Vector.lerp(this.A, D, lerp);
        }

        A = p5.Vector.sub(D, C);
        A.rotate(-p.PI/2);
        A = p5.Vector.add(C, A);
        A = p5.Vector.lerp(C, A, 1);

        B = p5.Vector.sub(C, D);
        B.rotate(p.PI/2);
        B = p5.Vector.add(D, B);
        B = p5.Vector.lerp(D, B, 1);

        let right = new Rectangle(A, B, C, D);

        if(this.commonPointOfChildren != null) {
            let center = p5.Vector.lerp(right.A, right.B, 0.5);
            let heading = p5.Vector.sub(center, right.B);
            let rootCenter = p5.Vector.lerp(this.A, this.B, 0.5);
            let rootHeading = p5.Vector.sub(rootCenter, this.B);
            let angle = rootHeading.angleBetween(p5.Vector.sub(this.commonPointOfChildren, rootCenter));

            heading.rotate(angle);
            heading = p5.Vector.add(center, heading);
            let commonPoint = p5.Vector.lerp(center, heading, right.size * 0.5 / p5.Vector.dist(heading, center));
            right.setCommonPointOfChildren(commonPoint);
        }

        return right;
    }

    draw(p: any) {
        p.beginShape();
        p.vertex(this.A.x, this.A.y);
        p.vertex(this.B.x, this.B.y);
        p.vertex(this.D.x, this.D.y);
        p.vertex(this.C.x, this.C.y);
        p.vertex(this.A.x, this.A.y);
        p.endShape();
    }
}