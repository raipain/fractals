import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SliderService {

  currentSlide = new BehaviorSubject<number>(1);

  constructor() { }

  setToSlide(slide: number) {
    this.currentSlide.next(slide);
  }

  getCurrentSlide() {
    return this.currentSlide;
  }


}
