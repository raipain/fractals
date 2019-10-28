import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SierpinskiCarpetDialogComponent } from './sierpinski-carpet-dialog.component';

describe('SierpinskiCarpetDialogComponent', () => {
  let component: SierpinskiCarpetDialogComponent;
  let fixture: ComponentFixture<SierpinskiCarpetDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SierpinskiCarpetDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SierpinskiCarpetDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
