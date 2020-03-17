import { AnimationStateManagerService } from '../services/animation-state-manager.service';
import { BehaviorSubject } from 'rxjs';
import { Fractal } from './fractal';

export abstract class ConfigurableFractal extends Fractal {
    protected play: boolean;
    protected stop: boolean;
    protected list: Array<any>;
    protected rollBack: boolean;
    protected rollBackTo: number;
    protected rollBackList$: BehaviorSubject<Array<any>>;
    protected rainbowMode: boolean;

    constructor(protected animationStateManagerService: AnimationStateManagerService) {
        super();
        this.play = false;
        this.stop = true;
        this.rollBack = false;
        this.list = [];
        this.rainbowMode = false;
        this.rollBackList$ = new BehaviorSubject<Array<any>>(this.list);
    }

    abstract sketch(p: any): void;

    _rollBack(p: any) {
        if (this.rollBack) {
            if (this.play) {
                for (let i = this.rollBackTo; i < this.list.length; i++) {
                    this.list[i].draw(p);
                }
                this.rollBack = false;
            }
            else {
                p.background(this.canvasColor);
                for (let i = 0; i < this.rollBackTo; i++) {
                    this.list[i].draw(p);
                }
            }
        }
    }

    saveCanvas(): void {
        this.p5.save(this.canvas, "myFractal.jpg");
    }

    getStatus(): boolean {
        return this.play;
    }

    togglePlay(): void {
        this.play = !this.play;
        if (this.play) {
            this.stop = false;
        }
    }

    setStop(): void {
        this.play = false;
        this.stop = true;
        this.rollBack = false;
        this.animationStateManagerService.setState(false);
        this.rollBackList$.next(this.list);
        this.p5.clear();
    }

    setUpRollBack(to: number) {
        this.rollBack = true;
        this.rollBackTo = to;
        this.play = false;
    }

    getObservable() {
        return this.rollBackList$;
    }

    setFrameRate(obj: any, speed: number): void {
        obj.frameRate = speed;
    }

    setColor(obj: any, color: string): void {
        obj.color = color;
        obj.rainbowMode = false;
        obj.setStop();
    }

    setStrokeWeight(obj: any, value: number): void {
        obj.strokeWeight = value;
        obj.setStop();
    }
    
    setRainbowMode(obj: any, value: boolean): void {
        obj.rainbowMode = value;
    }
}
