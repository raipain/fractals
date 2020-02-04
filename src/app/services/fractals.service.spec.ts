import { TestBed } from '@angular/core/testing';

import { FractalsService } from './fractals.service';

describe('FractalsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FractalsService = TestBed.get(FractalsService);
    expect(service).toBeTruthy();
  });
});
