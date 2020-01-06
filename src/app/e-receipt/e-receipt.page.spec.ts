import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EReceiptPage } from './e-receipt.page';

describe('EReceiptPage', () => {
  let component: EReceiptPage;
  let fixture: ComponentFixture<EReceiptPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EReceiptPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EReceiptPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
