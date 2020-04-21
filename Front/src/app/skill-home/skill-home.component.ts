import { Component, OnInit } from '@angular/core';
import { SkillServiceService } from '../skill-service.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Skill } from '../models/skill.model';
import * as firebase from 'firebase';
import { AuthService } from '../auth.service';
import { Home } from '../models/home.model';

@Component({
  selector: 'app-skill-home',
  templateUrl: './skill-home.component.html',
  styleUrls: ['./skill-home.component.css']
})
export class SkillHomeComponent implements OnInit {

  user;
  constructor(private skillService : SkillServiceService,private formBuilder: FormBuilder, private auth : AuthService){

  }
  isCheck = false;
  skillHome: Home;
  skillHomeForm: FormGroup;
  
  ngOnInit(): void {
    
    this.user= firebase.auth().currentUser;
    this.skillHome = new Home();
    this.skillService.getSingleSkillHome().then(
      (skillHome: Home) => {
        this.skillHome = skillHome;
        this.skillHomeForm = this.formBuilder.group({
          title: [this.skillHome.title, Validators.required],
          content: [this.skillHome.content, Validators.required]
        }); 
      }
    );
  }

  onChange(){
    this.isCheck = !(this.isCheck);
  }

  updateSkillHome() {
    const title = this.skillHomeForm.get('title').value;
    const content = this.skillHomeForm.get('content').value;
    // A post entry.
    var postData = {
      title: title,
      content: content
    };

    // Write the new post's data simultaneously in the posts list and the user's post list.
    var updates = {};
    updates['/SkillHome/'] = postData;
  
    firebase.database().ref().update(updates);

    this.renew();
    this.onChange();


  }

  renew(){
    this.skillService.getSingleSkillHome().then(
      (skillHome: Home) => {
        this.skillHome = skillHome;
      }
    );
  }
}
