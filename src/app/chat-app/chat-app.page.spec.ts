import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatAppPage } from './chat-app.page';

describe('ChatAppPage', () => {
  let component: ChatAppPage;
  let fixture: ComponentFixture<ChatAppPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatAppPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatAppPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
