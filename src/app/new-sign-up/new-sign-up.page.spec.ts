import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSignUpPage } from './new-sign-up.page';

describe('NewSignUpPage', () => {
  let component: NewSignUpPage;
  let fixture: ComponentFixture<NewSignUpPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewSignUpPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewSignUpPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
