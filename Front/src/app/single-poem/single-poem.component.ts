import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import * as firebase from 'firebase';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Poem } from '../models/poem.model';
import { FirebaseService } from '../firebase.service';
@Component({
  selector: 'app-single-poem',
  templateUrl: './single-poem.component.html',
  styleUrls: ['./single-poem.component.css']
})
export class SinglePoemComponent implements OnInit {

  Poems : Observable<any[]>;
  getId;
  poem :Poem;
  title : string;
  category : string;
  content : string;
  dataSource = this.Poems;
  constructor(private route: ActivatedRoute,public db : AngularFireDatabase, private firebaseService : FirebaseService ) { 
    this.Poems = db.list('Poems').valueChanges();
    this.dataSource = this.Poems;
    
  }

  ngOnInit(): void { 
   this.getId = this.route.snapshot.params.id;
   this.firebaseService.getPoemContent(this.getId).then(
    (poem: Poem) => {
      this.poem = poem;
    }
  );

  };

}
