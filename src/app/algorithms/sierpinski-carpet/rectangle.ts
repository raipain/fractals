import * as p5 from 'p5';

export class Rectangle {
    public center: p5.Vector;
    public size: number;
    public color: any;

    constructor(center: p5.Vector, size: number) {
        this.center = center;
        this.size = size;
    }

    divide(): Rectangle[] {
        let rectangles = [];
        
        rectangles.push(new Rectangle(new p5.Vector(this.center.x - this.size, this.center.y), this.size / 3));
        rectangles.push(new Rectangle(new p5.Vector(this.center.x - this.size, this.center.y + this.size), this.size / 3));
        rectangles.push(new Rectangle(new p5.Vector(this.center.x - this.size, this.center.y - this.size), this.size / 3));
        rectangles.push(new Rectangle(new p5.Vector(this.center.x + this.size, this.center.y), this.size / 3));
        rectangles.push(new Rectangle(new p5.Vector(this.center.x + this.size, this.center.y + this.size), this.size / 3));
        rectangles.push(new Rectangle(new p5.Vector(this.center.x + this.size, this.center.y - this.size), this.size / 3));
        rectangles.push(new Rectangle(new p5.Vector(this.center.x, this.center.y + this.size), this.size / 3));
        rectangles.push(new Rectangle(new p5.Vector(this.center.x, this.center.y - this.size), this.size / 3));
    
        return rectangles;
    }

    setColor(color: any) {
        this.color = color;
    }

    draw(p: any): void {
        p.rectMode(p.CENTER);
        p.fill(this.color);
        p.rect(this.center.x, this.center.y, this.size, this.size);
    }
}