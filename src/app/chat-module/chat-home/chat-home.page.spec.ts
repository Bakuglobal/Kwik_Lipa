import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatHomePage } from './chat-home.page';

describe('ChatHomePage', () => {
  let component: ChatHomePage;
  let fixture: ComponentFixture<ChatHomePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatHomePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatHomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
