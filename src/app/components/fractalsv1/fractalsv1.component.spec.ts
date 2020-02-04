import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Fractalsv1Component } from './fractalsv1.component';

describe('Fractalsv1Component', () => {
  let component: Fractalsv1Component;
  let fixture: ComponentFixture<Fractalsv1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Fractalsv1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Fractalsv1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
