import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscountmodalPage } from './discountmodal.page';

describe('DiscountmodalPage', () => {
  let component: DiscountmodalPage;
  let fixture: ComponentFixture<DiscountmodalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiscountmodalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscountmodalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
