import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewOrderPage } from './view-order.page';

describe('ViewOrderPage', () => {
  let component: ViewOrderPage;
  let fixture: ComponentFixture<ViewOrderPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewOrderPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewOrderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
