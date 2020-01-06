import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatmodalPage } from './chatmodal.page';

describe('ChatmodalPage', () => {
  let component: ChatmodalPage;
  let fixture: ComponentFixture<ChatmodalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatmodalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatmodalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
