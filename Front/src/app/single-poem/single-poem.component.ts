import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import * as firebase from 'firebase';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Poem } from '../models/poem.model';
import { FirebaseService } from '../firebase.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
@Component({
  selector: 'app-single-poem',
  templateUrl: './single-poem.component.html',
  styleUrls: ['./single-poem.component.css']
})
export class SinglePoemComponent implements OnInit { 
  poem: Poem;
  poemForm: FormGroup;
  isCheck = false;

  constructor(private route: ActivatedRoute, private fireService: FirebaseService,
              private router: Router,private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.poem = new Poem();
    const id = this.route.snapshot.params['id'];
    this.fireService.getSinglePoem(+id).then(
      (poem: Poem) => {
        this.poem = poem;
        this.poemForm = this.formBuilder.group({
          title: [this.poem.title, Validators.required],
          content: [this.poem.content, Validators.required]
        }); 
      }
    );
  }

  onBack() {
    this.router.navigate(['']);
  }
  onChange(){
    this.isCheck = !(this.isCheck);
  }
  renew(){
    const id = this.route.snapshot.params['id'];
    this.fireService.getSinglePoem(+id).then(
      (poem: Poem) => {
        this.poem = poem;
      }
    );
  }


  updatePoem() {
    const title = this.poemForm.get('title').value;
    const content = this.poemForm.get('content').value;
    const category = this.poem.category;
    const id = this.route.snapshot.params['id'];
    // A post entry.
    var postData = {
      title: title,
      content: content,
      category: category
    };
  
    // Write the new post's data simultaneously in the posts list and the user's post list.
    var updates = {};
    updates['/Poems/' + id] = postData;
  
    firebase.database().ref().update(updates);

    this.renew();
    this.onChange();


  }
}