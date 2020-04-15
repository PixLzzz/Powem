import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MailSnackbarComponent } from './mail-snackbar.component';

describe('MailSnackbarComponent', () => {
  let component: MailSnackbarComponent;
  let fixture: ComponentFixture<MailSnackbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MailSnackbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MailSnackbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
