import { Component, OnInit } from '@angular/core';
import { SliderService } from 'src/app/services/slider.service';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss']
})
export class SliderComponent implements OnInit {

  currentSlide: number = 1;

  constructor(private siderService: SliderService) { }

  ngOnInit() {
  }

  openSlide(slide: number) {
    this.currentSlide = slide;
    this.siderService.setToSlide(slide);
  }

}
