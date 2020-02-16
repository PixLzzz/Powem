import { Component, OnInit } from '@angular/core';
import { AuthService } from "../auth.service";
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isConnected : boolean;
  currentUser = "";
  isAdmin : boolean;
  constructor() { }

  ngOnInit(): void {
    firebase.auth().onAuthStateChanged(
      (user) => {
        if(user) {
          this.isConnected = true;
          this.currentUser = firebase.auth().currentUser.email;
          if(this.currentUser == "jlc@ogeu.com"){
            this.isAdmin = true;
          }else{
            this.isAdmin = false;
          }
        } else {
          this.isConnected = false;
        }
      }
    );
  }
  logOut(){
    firebase.auth().signOut().then(function() {
      console.log("Sign-out successful.")
    }).catch(function(error) {
      console.log("error")
    });
  }
}
