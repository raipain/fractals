import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AnimationStateManagerService {
  private state: BehaviorSubject<boolean>;

  constructor() {
    this.state = new BehaviorSubject<boolean>(false);
  }

  setState(state: boolean): void {
    this.state.next(state);
  }

  getState(): Observable<boolean> {
    return this.sate;
  }
}
