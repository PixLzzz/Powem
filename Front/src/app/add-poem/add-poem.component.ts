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

  selectedValue: string;
  id = 0;
  title = 'Ajouter un poème :';
  PoemTitle ;
  PoemContent ;
  Poems : Observable<any[]>;

  categories: Category[] = [
    {value: 'Amour', viewValue: 'Amour'},
    {value: 'Haine', viewValue: 'Haine'},
    {value: 'Jalousie', viewValue: 'Jalousie'}
  ];

  constructor(public db : AngularFireDatabase){
    this.Poems = db.list('Poems').valueChanges(); 
  }

  ngOnInit(): void {
    console.log(firebase.auth().currentUser)
  }

  onSubmit(){
    this.id = this.id + 1;
      firebase.database().ref('Poems/' + this.id).set({
        id: this.id,
        title: this.PoemTitle,
        content: this.PoemContent,
        category : this.selectedValue
      });
  }

}

interface Category {
  value: string;
  viewValue: string;
}