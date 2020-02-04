import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FractalsService } from 'src/app/services/fractals.service';
import { IFractalList } from 'src/app/models/fractal-list';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements OnInit, AfterViewInit {
  
  ngAfterViewInit(): void {
    console.log(this.container.nativeElement.offsetHeight, this.container.nativeElement.offsetWidth);
  }

  @ViewChild('canvas', {read: ElementRef, static: false}) container: ElementRef;
  fractalList: IFractalList[];
  selectedFractal: number;
  title: string = "Kérlek válassz algoritmust!";

  constructor(private fractalService: FractalsService) {
    this.fractalList = fractalService.getList();
    fractalService.getSelectedFractal().subscribe((index: number) => { 
      this.selectedFractal = index;
      if(this.selectedFractal != null) {
        this.title = this.fractalList[this.selectedFractal].name;
        this.fractalList[this.selectedFractal].algorithm.init("canvas", this.container.nativeElement.offsetWidth, this.container.nativeElement.offsetHeight, 50);
      }
    });
  }

  ngOnInit() { }

}
