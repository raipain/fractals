import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FractalsComponent } from './fractals.component';

describe('FractalsComponent', () => {
  let component: FractalsComponent;
  let fixture: ComponentFixture<FractalsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FractalsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FractalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
