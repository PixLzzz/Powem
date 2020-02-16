import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPoemComponent } from './add-poem.component';

describe('AddPoemComponent', () => {
  let component: AddPoemComponent;
  let fixture: ComponentFixture<AddPoemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPoemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPoemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
