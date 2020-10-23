import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopModalPage } from './shop-modal.page';

describe('ShopModalPage', () => {
  let component: ShopModalPage;
  let fixture: ComponentFixture<ShopModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShopModalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
