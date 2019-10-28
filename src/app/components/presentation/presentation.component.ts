import { Component, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';

//#region @Component 
@Component({
  selector: 'app-presentation',
  templateUrl: './presentation.component.html',
  styleUrls: ['./presentation.component.scss'],
  animations: [
    trigger('content', [
      state('state-1', style({
        transform: 'translateX(0)'
      })),
      state('state-2', style({
        transform: 'translateX(-100%)'
      })),
      state('state-4', style({
        transform: 'translateX(-200%)'
      })),
      state('state-7', style({
        transform: 'translateX(-300%)'
      })),
      state('state-10', style({
        transform: 'translateX(-400%)'
      })),
      transition('*=>*', animate('1s'))
    ]),
    trigger('intro', [
      state('state-1', style({
        transform: 'translateX(100%)'
      })),
      state('state-2', style({
        transform: 'translateX(0)'
      })),
      state('state-4', style({
        transform: 'translateX(-100%)'
      })),
      state('state-7', style({
        transform: 'translateX(-200%)'
      })),
      state('state-10', style({
        transform: 'translateX(-300%)'
      })),
      transition('*=>*', animate('1s'))
    ]),
    trigger('slide-2', [
      state('state-1', style({
        transform: 'translateX(100%)'
      })),
      state('state-2', style({
        transform: 'translateX()'
      })),
      state('state-4', style({
        transform: 'translateX(0)'
      })),
      state('state-7', style({
        transform: 'translateX(-100%)'
      })),
      state('state-10', style({
        transform: 'translateX(-200%)'
      })),
      transition('*=>*', animate('1s'))
    ]),
    trigger('slide-3', [
      state('state-1', style({
        transform: 'translateX(200%)'
      })),
      state('state-4', style({
        transform: 'translateX(100%)'
      })),
      state('state-7', style({
        transform: 'translateX(0)'
      })),
      state('state-10', style({
        transform: 'translateX(-100%)'
      })),
      transition('*=>*', animate('1s'))
    ]),
    trigger('slide-4', [
      state('state-1', style({
        transform: 'translateX(300%)'
      })),
      state('state-4', style({
        transform: 'translateX(200%)'
      })),
      state('state-7', style({
        transform: 'translateX(100%)'
      })),
      state('state-10', style({
        transform: 'translateX(0)'
      })),
      transition('*=>*', animate('1s'))
    ])
  ]
})
//#endregion

export class PresentationComponent implements OnInit {

  private states: number = 12;
  private currentState: number = 1;
  private fullScreen: boolean = false;

  constructor() {
  }

  ngOnInit() {
    let outerThis = this;
    document.onfullscreenchange = () => {
      if(!document.fullscreen) {
        outerThis.fullScreen = false;
      }
    }
  }

  setToState(state) {
    if(state > 0 && state <= this.states) {
      this.currentState = state;
    }
  }

  nextState() {
    if(this.currentState < this.states) {
      this.states++;
    }
  }

  prevState() {
    if(this.currentState > 0) {
      this.states--;
    }
  }

  getState() {
    return this.currentState;
  }

  getStateString() {
    return "state-" + this.currentState;
  }

  openFullscreen() {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    }
    this.fullScreen = true;
  }

}
