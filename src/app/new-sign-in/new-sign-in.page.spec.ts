import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSignInPage } from './new-sign-in.page';

describe('NewSignInPage', () => {
  let component: NewSignInPage;
  let fixture: ComponentFixture<NewSignInPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewSignInPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewSignInPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
