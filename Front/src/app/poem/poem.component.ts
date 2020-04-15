import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { FirebaseService } from '../firebase.service';

@Component({
  selector: 'app-poem',
  templateUrl: './poem.component.html',
  styleUrls: ['./poem.component.css']
})
export class PoemComponent implements OnInit {

  displayedColumns: string[] = ['name', 'categories'];
  selectedOptions=[];
  selectedOption;

  categories: string[] = ['Essais', 'Coups de cœur', 'En chemin' , 'Être' , 'Société' , 'Spiritualité' , 'Tendresse'];
  
  constructor(public db : AngularFireDatabase,private router: Router, private firebaseService : FirebaseService){

  }
  
  ngOnInit(): void {
    
  }

  
    
    onNgModelChange($event){
      this.selectedOption=$event;
      console.log(this.selectedOption)
      this.selectedOptions = this.selectedOption;
      this.firebaseService.emitCats(this.selectedOption)
    }

}
