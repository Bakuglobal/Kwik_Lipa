import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSignInCodePage } from './new-sign-in-code.page';

describe('NewSignInCodePage', () => {
  let component: NewSignInCodePage;
  let fixture: ComponentFixture<NewSignInCodePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewSignInCodePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewSignInCodePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
