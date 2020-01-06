import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IpaytransmodalPage } from './ipaytransmodal.page';

describe('IpaytransmodalPage', () => {
  let component: IpaytransmodalPage;
  let fixture: ComponentFixture<IpaytransmodalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IpaytransmodalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IpaytransmodalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
