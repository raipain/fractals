import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Intro01Component } from './intro01.component';

describe('Intro01Component', () => {
  let component: Intro01Component;
  let fixture: ComponentFixture<Intro01Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Intro01Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Intro01Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
