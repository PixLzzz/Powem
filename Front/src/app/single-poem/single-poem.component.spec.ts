import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SinglePoemComponent } from './single-poem.component';

describe('SinglePoemComponent', () => {
  let component: SinglePoemComponent;
  let fixture: ComponentFixture<SinglePoemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SinglePoemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SinglePoemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
