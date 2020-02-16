import { Injectable, NgZone } from '@angular/core';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userData: any;
  constructor(public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router, 
    public ngZone: NgZone) {
      this.afAuth.authState.subscribe(user => {
        if (user) {
          this.userData = user; // Setting up user data in userData var
          localStorage.setItem('user', JSON.stringify(this.userData));
          JSON.parse(localStorage.getItem('user'));
        } else {
          localStorage.setItem('user', null);
          JSON.parse(localStorage.getItem('user'));
        }
      })
     }

    // Sign in with email/password
    static doRegister(value){
      return new Promise<any>((resolve, reject) => {
        firebase.auth().signInWithEmailAndPassword(value.email, value.password)
        .then(res => {
          resolve(res);
        }, err => reject(err))
      })
    }
  

}
