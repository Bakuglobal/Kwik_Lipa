import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumeChatPage } from './resume-chat.page';

describe('ResumeChatPage', () => {
  let component: ResumeChatPage;
  let fixture: ComponentFixture<ResumeChatPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResumeChatPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResumeChatPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
