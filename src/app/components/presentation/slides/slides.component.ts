import { Component, OnInit } from '@angular/core';
import { SliderService } from 'src/app/services/slider.service';
import { Observable } from 'rxjs';
import { SliderAnimation } from 'src/app/animations/slider.animation';

@Component({
  selector: 'app-slides',
  templateUrl: './slides.component.html',
  styleUrls: ['./slides.component.scss'],
  animations: SliderAnimation
})
export class SlidesComponent implements OnInit {

  currentSlide$: Observable<number>;

  constructor(private sliderService: SliderService) { }

  ngOnInit() {
    this.currentSlide$ = this.sliderService.getCurrentSlide();
  }

}
