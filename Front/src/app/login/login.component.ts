import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  errorMessage = '';
  hide = true;

  profileForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  constructor(public router: Router) {}

  ngOnInit(): void {}

  onSubmit() {
    if (this.profileForm.invalid) { return; }
    AuthService.doLogin(this.profileForm.value)
      .then(() => {
        this.router.navigate(['']);
      }, err => {
        this.errorMessage = err.message;
      });
  }
}
