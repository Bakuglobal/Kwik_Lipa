import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyCodePage } from './verify-code.page';

describe('VerifyCodePage', () => {
  let component: VerifyCodePage;
  let fixture: ComponentFixture<VerifyCodePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerifyCodePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifyCodePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
