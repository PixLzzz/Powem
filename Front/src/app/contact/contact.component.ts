import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AngularFireDatabase } from '@angular/fire/compat/database';
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

  private escapeHtml(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  createForm() {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(254)]],
      message: ['', [Validators.required, Validators.maxLength(5000)]],
    });
  }
  onSubmit() {
    const {name, email, message} = this.form.value;
    const date = Date();
    const safeName = this.escapeHtml(name);
    const safeEmail = this.escapeHtml(email);
    const safeMessage = this.escapeHtml(message);
    const html = `
      <div>From: ${safeName}</div>
      <div>Email: <a href="mailto:${safeEmail}">${safeEmail}</a></div>
      <div>Date: ${date}</div>
      <div>Message: ${safeMessage}</div>
    `;
    let formRequest = { name: safeName, email: safeEmail, message: safeMessage, date, html };
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
