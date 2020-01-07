import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScannedModalPage } from './scanned-modal.page';

describe('ScannedModalPage', () => {
  let component: ScannedModalPage;
  let fixture: ComponentFixture<ScannedModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScannedModalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScannedModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
