import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FractalsService } from 'src/app/services/fractals.service';
import { IFractalList } from 'src/app/models/fractal-list';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  @Output() canvas: EventEmitter<void> = new EventEmitter<void>();
  private algorithms: IFractalList[];

  constructor(private fractalService: FractalsService) { }

  ngOnInit() {
    this.algorithms = this.fractalService.getList();
    this.algorithms.forEach(algorithm => {
      algorithm.preview.init(algorithm.previewId, 150, 150, "#437a99");
    })
  }

  selectAlgorithm(index: number): void {
    this.fractalService.selectFractal(index);
    this.canvas.emit();
  }

}
