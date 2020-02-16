import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthService } from "../auth.service";
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  errorMessage = "";
  successMessage = "";
  profileForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });
  constructor(public router: Router) { }

  ngOnInit(): void {
  }
  onSubmit() {
    // TODO: Use EventEmitter with form value
    this.tryRegister(this.profileForm.value);
  }

  tryRegister(value){
    AuthService.doRegister(value)
    .then(res => {
      console.log(res);
      this.router.navigate(['']);
    }, err => {
      console.log(err);
      this.errorMessage = err.message;
      this.successMessage = "";
    })
  }

}
