import { TestBed } from '@angular/core/testing';

import { MpesaService } from './mpesa.service';

describe('MpesaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MpesaService = TestBed.get(MpesaService);
    expect(service).toBeTruthy();
  });
});
