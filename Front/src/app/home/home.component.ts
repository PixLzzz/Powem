import { Component, OnInit, Input } from '@angular/core';
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
  selectedOptions=[];
  selectedOption;

  categories: string[] = ['Essais', 'Coups de cœur', 'En chemin' , 'Être' , 'Société' , 'Spiritualité' , 'Tendresse'];
  
  constructor(public db : AngularFireDatabase,private router: Router){

  }
  
  ngOnInit(): void {
    console.log(firebase.auth().currentUser)
  }

  
    
    onNgModelChange($event){
      this.selectedOption=$event;
      console.log(this.selectedOption)
      
    }

}