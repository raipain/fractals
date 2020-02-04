import { Component, OnInit, ViewChild, ElementRef, OnChanges, EventEmitter, Output } from '@angular/core';
import { FractalsService } from 'src/app/services/fractals.service';
import { IFractalList } from 'src/app/models/fractal-list';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-drawing',
  templateUrl: './drawing.component.html',
  styleUrls: ['./drawing.component.scss'],
  animations: [
    trigger('listAnimation', [
      state('show', style({ width: 'calc(100vw - 300px)' })),
      state('hide', style({ width: 'calc(100vw - 165px)'  })),
      transition('show <=> hide', animate('275ms ease-in-out'))
    ])
  ]
})

export class DrawingComponent implements OnInit {

  @ViewChild('container', {read: ElementRef, static:false}) container: ElementRef;
  @Output() listStatus = new EventEmitter<string>();
  listAnimation: string;
  selectedFractal;
  list: IFractalList[];
  nullText = "Kérlek válassz egy alogritmust!"
  lol = 5;

  constructor(private fractalService: FractalsService) {
    fractalService.getSelectedFractal().subscribe(index => {
      console.log(index);
      if(index != null) {
        this.list[index].algorithm.init("drawing", 150, 150, 10);
      }
      this.selectedFractal = index;
    });
  }

  ngOnInit() {
    this.listAnimation = "show";
    this.list = this.fractalService.getList();
  }

  toggleList() {
    console.log("asd");
    if(this.listAnimation == "show") {
      this.listStatus.emit("hide");
      this.listAnimation = "hide";
    } 
    else {
      this.listStatus.emit("show");
      this.listAnimation = "show";
    }
  }

  removeCanvas() {
    this.list[this.selectedFractal].algorithm.removeCanvas();
  }
}
