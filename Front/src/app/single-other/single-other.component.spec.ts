import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleOtherComponent } from './single-other.component';

describe('SingleOtherComponent', () => {
  let component: SingleOtherComponent;
  let fixture: ComponentFixture<SingleOtherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleOtherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleOtherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
