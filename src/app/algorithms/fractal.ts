import * as p5 from 'p5';

export abstract class Fractal {
    protected p5: any;
    protected canvas: any;
    protected canvasColor: string;
    protected width: number;
    protected height: number;
    protected parentId: string;
    protected frameRate: number;
    protected strokeWeight: number;
    protected color: string;
    protected iter: number;

    constructor() {
        this.frameRate = 1;
        this.strokeWeight = 1;
        this.color = "#000";
        this.sketch = this.sketch.bind(this);
        this.iter = 0;
    }

    init(parentId: string, width: number, height: number, canvasColor: string): void {
        if(this.p5 != null) {
            this.removeCanvas();
        }
        this.parentId = parentId;
        this.width = width;
        this.height = height;
        this.canvasColor = canvasColor;
    }

    abstract sketch(p: any): void;

    createCanvas(): void {
        this.p5 = new p5(this.sketch);
    }

    removeCanvas(): void {
        this.p5.remove();
    }

    clearCanvas(): void {
        this.p5.clear();
    }

    setFrameRate(obj: any, speed: number): void {
        obj.frameRate = speed;
    }

    setColor(obj: any, color: string): void {
        obj.color = color;
    }

    setStrokeWeight(obj: any, value: number): void {
        obj.strokeWeight = value;
    }
}
