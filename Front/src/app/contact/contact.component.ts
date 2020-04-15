import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AngularFireDatabase } from 'angularfire2/database';
import { MailSnackbarComponent } from '../mail-snackbar/mail-snackbar.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  durationInSeconds = 5;
  form: FormGroup;
  constructor(private fb: FormBuilder, private af: AngularFireDatabase,private _snackBar: MatSnackBar) {
    this.createForm();
  }
  ngOnInit() {
  }
  createForm() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      message: ['', Validators.required],
    });
  }
  onSubmit() {
    const {name, email, message} = this.form.value;
    const date = Date();
    const html = `
      <div>From: ${name}</div>
      <div>Email: <a href="mailto:${email}">${email}</a></div>
      <div>Date: ${date}</div>
      <div>Message: ${message}</div>
    `;
    let formRequest = { name, email, message, date, html };
    this.af.list('/messages').push(formRequest);
    this.form.reset();

    this.notifConfirm();
  }

  notifConfirm(){
    this._snackBar.openFromComponent(MailSnackbarComponent, {
      duration: this.durationInSeconds * 1000,
    });
  }
}
