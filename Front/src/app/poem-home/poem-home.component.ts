import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../firebase.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Skill } from '../models/skill.model';
import * as firebase from 'firebase';

@Component({
  selector: 'app-poem-home',
  templateUrl: './poem-home.component.html',
  styleUrls: ['./poem-home.component.css']
})
export class PoemHomeComponent implements OnInit {

  user;
  constructor(private fireService : FirebaseService,private formBuilder: FormBuilder){

  }
  isCheck = false;
  poemHome: Skill;
  poemHomeForm: FormGroup;
  
  ngOnInit(): void {
    this.user = firebase.auth().currentUser;
    this.poemHome = new Skill();
    this.fireService.getSinglePoemHome().then(
      (site: Skill) => {
        this.poemHome = site;
        this.poemHomeForm = this.formBuilder.group({
          title: [this.poemHome.title, Validators.required],
          content: [this.poemHome.content, Validators.required]
        }); 
      }
    );
  }

  onChange(){
    this.isCheck = !(this.isCheck);
  }

  updatePoemHome() {
    const title = this.poemHomeForm.get('title').value;
    const content = this.poemHomeForm.get('content').value;
    // A post entry.
    var postData = {
      title: title,
      content: content
    };

    // Write the new post's data simultaneously in the posts list and the user's post list.
    var updates = {};
    updates['/PoemHome/'] = postData;
  
    firebase.database().ref().update(updates);

    this.renew();
    this.onChange();


  }

  renew(){
    this.fireService.getSinglePoemHome().then(
      (poemHome: Skill) => {
        this.poemHome = poemHome;
      }
    );
  }

}
