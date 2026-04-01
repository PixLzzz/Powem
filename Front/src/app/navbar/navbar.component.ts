import { Component, OnInit } from '@angular/core';
import firebase from 'firebase/compat/app';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css'],
    standalone: false
})
export class NavbarComponent implements OnInit {
  isConnected = false;
  menuOpen = false;

  ngOnInit(): void {
    firebase.auth().onAuthStateChanged((user) => {
      this.isConnected = !!user;
      this.menuOpen = false;
    });
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu() {
    this.menuOpen = false;
  }

  logOut() {
    firebase.auth().signOut().then(() => {
      this.isConnected = false;
      this.menuOpen = false;
      window.location.reload();
    });
  }
}
