import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { trigger, transition, style, animate, state } from '@angular/animations';
import { FractalsService } from 'src/app/services/fractals.service';
import { IFractalList } from 'src/app/models/fractal-list';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})

export class ListComponent implements OnInit {

  @Input() listStatus;
  list: IFractalList[];
  selectedFractal = null;

  constructor(private fractalService: FractalsService) {
    this.list = fractalService.getList();
    for(let i = 0; i < this.list.length; i++) {
      this.list[i].preview.init(this.list[i].previewId, 150, 150, 10);
    }
  }

  ngOnInit() { }

  selectFractal(index) {
    this.selectedFractal = index;
    this.fractalService.selectFractal(index);
  }

}
