import { Component, OnInit } from '@angular/core';
import { IFractalList } from 'src/app/models/fractal-list';
import { FractalsService } from 'src/app/services/fractals.service';

@Component({
  selector: 'app-conf',
  templateUrl: './conf.component.html',
  styleUrls: ['./conf.component.scss']
})
export class ConfComponent implements OnInit {

  list: IFractalList[];
  selected: number;

  constructor(private fractalService: FractalsService) { }

  ngOnInit() {
    this.fractalService.getSelectedFractal().subscribe(index => {
      this.selected = index;
    })
    
    this.list = this.fractalService.getList();
  }

}
