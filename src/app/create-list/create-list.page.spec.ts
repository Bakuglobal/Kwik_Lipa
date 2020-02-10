import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateListPage } from './create-list.page';

describe('CreateListPage', () => {
  let component: CreateListPage;
  let fixture: ComponentFixture<CreateListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateListPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
