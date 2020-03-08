import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { FractalsService } from 'src/app/services/fractals.service';
import { AnimationStateManagerService } from 'src/app/services/animation-state-manager.service';
import { IFractalList } from 'src/app/models/fractal-list';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements OnInit, AfterViewInit {
  
  @ViewChild('canvas', {read: ElementRef, static: false}) container: ElementRef;
  @Output() home: EventEmitter<void> = new EventEmitter<void>();

  private canvasWidth;
  private canvasHeight;
  private fractalList: IFractalList[];
  private selectedFractal: number;
  private title: string;
  private play: boolean = false;
  private sliderLength: number;
  private animationState: boolean;

  constructor(private fractalService: FractalsService, private animationStateManagerService: AnimationStateManagerService) {
    this.fractalList = fractalService.getList();
  }

  ngOnInit() {
    this.canvasHeight = window.innerHeight * 0.7;
    this.canvasWidth = window.innerWidth * 0.75 ;
    this.animationStateManagerService.getState().subscribe((state: boolean) => { this.animationState = state });
  }

  ngAfterViewInit(): void {
    this.fractalService.getSelectedFractal().subscribe((index: number) => {
      if(index != null) {
        if(this.selectedFractal != null) {
          this.fractalList[this.selectedFractal].algorithm.removeCanvas();
        }
        this.selectedFractal = index;
        this.title = this.fractalList[this.selectedFractal].name;
        this.fractalList[this.selectedFractal].algorithm.init("canvas", this.canvasWidth, this.canvasHeight, "#f3f3f3");
        this.fractalList[this.selectedFractal].algorithm.getObservable().subscribe(ret => {
          this.sliderLength = ret.length;
        })
      }
    });
  }

  setSpeed(speed: number): void {
    this.fractalList[this.selectedFractal].algorithm.setSpeed(speed);
  }

  togglePlay(): void {
    this.animationStateManagerService.setState(!this.animationState);
    this.fractalList[this.selectedFractal].algorithm.togglePlay();
    this.play = !this.play;
  }

  stop(): void {
    this.animationStateManagerService.setState(false);
    this.fractalList[this.selectedFractal].algorithm.setStop();
    this.play = false;
  }

  save(): void {
    this.fractalList[this.selectedFractal].algorithm.saveCanvas();
  }

  rollBack(value: number) {
    this.fractalList[this.selectedFractal].algorithm.setUpRollBack(value);
  }

  homepage() {
    this.home.emit();
  }

}
