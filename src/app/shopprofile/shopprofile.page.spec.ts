import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopprofilePage } from './shopprofile.page';

describe('ShopprofilePage', () => {
  let component: ShopprofilePage;
  let fixture: ComponentFixture<ShopprofilePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShopprofilePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopprofilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
