import { TestBed } from '@angular/core/testing';

import { GetterService } from './getter.service';

describe('GetterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GetterService = TestBed.get(GetterService);
    expect(service).toBeTruthy();
  });
});
