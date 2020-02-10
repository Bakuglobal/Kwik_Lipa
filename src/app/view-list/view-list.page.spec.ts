import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewListPage } from './view-list.page';

describe('ViewListPage', () => {
  let component: ViewListPage;
  let fixture: ComponentFixture<ViewListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewListPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
