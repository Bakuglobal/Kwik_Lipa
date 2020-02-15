import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscountproductsPage } from './discountproducts.page';

describe('DiscountproductsPage', () => {
  let component: DiscountproductsPage;
  let fixture: ComponentFixture<DiscountproductsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiscountproductsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscountproductsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
