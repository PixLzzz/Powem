import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import * as firebase from 'firebase';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Poem } from '../models/poem.model';
import { FirebaseService } from '../firebase.service';
@Component({
  selector: 'app-single-poem',
  templateUrl: './single-poem.component.html',
  styleUrls: ['./single-poem.component.css']
})
export class SinglePoemComponent implements OnInit { 
  poem: Poem;

  constructor(private route: ActivatedRoute, private fireService: FirebaseService,
              private router: Router) {}

  ngOnInit() {
    this.poem = new Poem();
    const id = this.route.snapshot.params['id'];
    this.fireService.getSinglePoem(+id).then(
      (poem: Poem) => {
        this.poem = poem;
      }
    );
  }

  onBack() {
    this.router.navigate(['']);
  }
}