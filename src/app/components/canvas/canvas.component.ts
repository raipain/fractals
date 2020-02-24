import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FractalsService } from 'src/app/services/fractals.service';
import { IFractalList } from 'src/app/models/fractal-list';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements OnInit {

  @ViewChild('canvas', {read: ElementRef, static: false}) container: ElementRef;
  private fractalList: IFractalList[];
  private selectedFractal: number;
  private title: string = "Kérlek válassz algoritmust!";
  private play: boolean = false;
  private sliderLength: number;


  constructor(private fractalService: FractalsService) {
    this.fractalList = fractalService.getList();
    fractalService.getSelectedFractal().subscribe((index: number) => {
      if(index != null) {
        if(this.selectedFractal != null) {
          this.fractalList[this.selectedFractal].algorithm.removeCanvas();
        }
        this.selectedFractal = index;
        this.title = this.fractalList[this.selectedFractal].name;
        this.fractalList[this.selectedFractal].algorithm.init("canvas", this.container.nativeElement.offsetWidth, this.container.nativeElement.offsetHeight, "#f3f3f3");
        if(this.fractalList[this.selectedFractal].observable != null) {
          this.fractalList[this.selectedFractal].algorithm.getStoredPoints().subscribe(ret => {
            this.sliderLength = ret.length;
          })
        }
      }
    });
  }

  ngOnInit() { }

  setSpeed(speed: number): void {
    this.fractalList[this.selectedFractal].algorithm.setSpeed(speed);
  }

  togglePlay(): void {
    this.fractalList[this.selectedFractal].algorithm.togglePlay();
    this.play = !this.play;
  }

  stop(): void {
    this.fractalList[this.selectedFractal].algorithm.stop();
    this.play = false;
  }

  save(): void {
    this.fractalList[this.selectedFractal].algorithm.saveCanvas();
  }

  rollBack(value: number) {
    this.fractalList[this.selectedFractal].algorithm.setUpRollBack(value);
  }

}
