import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { FirebaseService } from '../firebase.service';
import { OtherService } from '../other.service';

@Component({
  selector: 'app-other',
  templateUrl: './other.component.html',
  styleUrls: ['./other.component.css']
})
export class OtherComponent implements OnInit {


  displayedColumns: string[] = ['name', 'categories'];
  selectedOptions=[];
  selectedOption;

  categories: string[] = ['Essais', 'Coups de cœur', 'En chemin' , 'Être' , 'Société' , 'Spiritualité' , 'Tendresse'];
  
  constructor(public db : AngularFireDatabase,private router: Router, private otherService : OtherService){

  }
  
  ngOnInit(): void {
    
  }
  
    
    onNgModelChange($event){
      this.selectedOption=$event;
      console.log(this.selectedOption)
      this.selectedOptions = this.selectedOption;
      this.otherService.emitCats(this.selectedOption)
    }

}
