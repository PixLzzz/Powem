import { Injectable } from '@angular/core';
import firebase from 'firebase/compat/app';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router, CanActivate } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements CanActivate {
  userData: any;

  constructor(public afAuth: AngularFireAuth, public router: Router) {}

  static doLogin(value: { email: string; password: string }) {
    return new Promise<any>((resolve, reject) => {
      firebase.auth().signInWithEmailAndPassword(value.email, value.password)
        .then(res => resolve(res), err => reject(err));
    });
  }

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    return new Promise((resolve) => {
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          this.userData = user;
          localStorage.setItem('user', JSON.stringify(user));
          resolve(true);
        } else {
          localStorage.removeItem('user');
          this.router.navigate(['/login']);
          resolve(false);
        }
      });
    });
  }
}
