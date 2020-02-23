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
  fractalList: IFractalList[];
  selectedFractal: number;
  title: string = "Kérlek válassz algoritmust!";
  play: boolean = false;

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
      }
    });
  }

  ngOnInit() { }

  setSpeed(speed: number) {
    this.fractalList[this.selectedFractal].algorithm.setSpeed(speed);
  }

  togglePlay() {
    this.fractalList[this.selectedFractal].algorithm.togglePlay();
    this.play = !this.play;
  }

  stop() {
    this.fractalList[this.selectedFractal].algorithm.stop();
    this.play = false;
  }

  save() {
    this.fractalList[this.selectedFractal].algorithm.saveCanvas();
  }

}
