import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import * as firebase from 'firebase';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {


  displayedColumns: string[] = ['name', 'categories'];


  categories: string[] = ['Amour', 'Haine', 'Jalousie'];
  
  constructor(public db : AngularFireDatabase,private router: Router){

  }
  
  ngOnInit(): void {
    console.log(firebase.auth().currentUser)
  }

}