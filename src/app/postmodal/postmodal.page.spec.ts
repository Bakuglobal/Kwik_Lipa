import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostmodalPage } from './postmodal.page';

describe('PostmodalPage', () => {
  let component: PostmodalPage;
  let fixture: ComponentFixture<PostmodalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostmodalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostmodalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
