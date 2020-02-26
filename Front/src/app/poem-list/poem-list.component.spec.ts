import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PoemListComponent } from './poem-list.component';

describe('PoemListComponent', () => {
  let component: PoemListComponent;
  let fixture: ComponentFixture<PoemListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PoemListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoemListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
