import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SierpinskiCarpetComponent } from './sierpinski-carpet.component';

describe('SierpinskiCarpetComponent', () => {
  let component: SierpinskiCarpetComponent;
  let fixture: ComponentFixture<SierpinskiCarpetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SierpinskiCarpetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SierpinskiCarpetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
