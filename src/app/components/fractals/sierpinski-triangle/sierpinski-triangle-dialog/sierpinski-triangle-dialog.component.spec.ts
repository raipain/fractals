import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SierpinskiTriangleDialogComponent } from './sierpinski-triangle-dialog.component';

describe('SierpinskiTriangleDialogComponent', () => {
  let component: SierpinskiTriangleDialogComponent;
  let fixture: ComponentFixture<SierpinskiTriangleDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SierpinskiTriangleDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SierpinskiTriangleDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
