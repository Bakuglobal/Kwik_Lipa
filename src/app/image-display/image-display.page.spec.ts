import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageDisplayPage } from './image-display.page';

describe('ImageDisplayPage', () => {
  let component: ImageDisplayPage;
  let fixture: ComponentFixture<ImageDisplayPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageDisplayPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageDisplayPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
