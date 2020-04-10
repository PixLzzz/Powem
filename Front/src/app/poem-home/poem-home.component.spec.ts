import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PoemHomeComponent } from './poem-home.component';

describe('PoemHomeComponent', () => {
  let component: PoemHomeComponent;
  let fixture: ComponentFixture<PoemHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PoemHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoemHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
