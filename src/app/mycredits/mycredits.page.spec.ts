import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MycreditsPage } from './mycredits.page';

describe('MycreditsPage', () => {
  let component: MycreditsPage;
  let fixture: ComponentFixture<MycreditsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MycreditsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MycreditsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
