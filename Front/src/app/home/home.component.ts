import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';
import * as firebase from 'firebase';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  Poems : Observable<any[]>;
  displayedColumns: string[] = ['name', 'categories'];
  dataSource = this.Poems;

  categories: string[] = ['Amour', 'Haine', 'Jalousie'];
  
  constructor(public db : AngularFireDatabase,private router: Router){
    this.Poems = db.list('Poems').valueChanges(); 
    this.dataSource = this.Poems;
  }

  ngOnInit(): void {
    console.log(firebase.auth().currentUser)
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    //this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}