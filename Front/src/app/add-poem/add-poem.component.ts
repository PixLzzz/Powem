import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';
import * as firebase from 'firebase';

@Component({
  selector: 'app-add-poem',
  templateUrl: './add-poem.component.html',
  styleUrls: ['./add-poem.component.css']
})
export class AddPoemComponent implements OnInit {


  title = 'Ajouter un poème :';
  PoemTitle = "";
  PoemContent = '';
  Poems : Observable<any[]>;

  constructor(public db : AngularFireDatabase){
    this.Poems = db.list('Poems').valueChanges(); 
  }

  ngOnInit(): void {
    console.log(firebase.auth().currentUser)
  }

  onSubmit(){
    this.db.list('Poems').push({title : this.PoemTitle ,content : this.PoemContent});
    this.PoemTitle = "" ;
    this.PoemContent = '' ; 

  }





}
