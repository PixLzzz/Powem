import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';
import * as firebase from 'firebase';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  Poems : Observable<any[]>;
  displayedColumns: string[] = ['name', 'categories'];
  
  
  constructor(public db : AngularFireDatabase){
    this.Poems = db.list('Poems').valueChanges(); 
  }

  ngOnInit(): void {
    console.log(firebase.auth().currentUser)
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
   // this.Poems.filter = filterValue.trim().toLowerCase();
  }

}
