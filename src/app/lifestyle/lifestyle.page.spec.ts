import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LifestylePage } from './lifestyle.page';

describe('LifestylePage', () => {
  let component: LifestylePage;
  let fixture: ComponentFixture<LifestylePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LifestylePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LifestylePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
