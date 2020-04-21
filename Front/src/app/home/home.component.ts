import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import * as firebase from 'firebase';
import { Router } from '@angular/router';
import { Poem } from '../models/poem.model';
import { Skill } from '../models/skill.model';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { FirebaseService } from '../firebase.service';
import { AuthService } from '../auth.service';
import { Home } from '../models/home.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private fireService : FirebaseService,private formBuilder: FormBuilder, private authService : AuthService){

  }
  isCheck = false;
  site: Home;
  siteForm: FormGroup;
  user;
  /*
  ckeConfig: any;
  mycontent: string;
  log: string = '';
  @ViewChild("myckeditor") ckeditor: any;
  */

  ngOnInit(): void {
    /*
    this.ckeConfig = {
      allowedContent: false,
      extraPlugins: 'divarea',
      forcePasteAsPlainText: true
    };
    */
    this.user = firebase.auth().currentUser;
    this.site = new Home();
    this.fireService.getSingleSite().then(
      (site: Home) => {
        this.site = site;
        this.siteForm = this.formBuilder.group({
          title: [this.site.title, Validators.required],
          content: [this.site.content, Validators.required]
        }); 
      }
    );
  }
/*
  onNChange($event: any): void {
    console.log("onChange");
    //this.log += new Date() + "<br />";
  }

  onPaste($event: any): void {
    console.log("onPaste");
    //this.log += new Date() + "<br />";
  }*/

  onChange(){
    this.isCheck = !(this.isCheck);
  }

  updateSite() {
    const title = this.siteForm.get('title').value;
    const content = this.siteForm.get('content').value;
    // A post entry.
    var postData = {
      title: title,
      content: content
    };

    // Write the new post's data simultaneously in the posts list and the user's post list.
    var updates = {};
    updates['/Site/'] = postData;
  
    firebase.database().ref().update(updates);

    this.renew();
    this.onChange();


  }

  renew(){
    this.fireService.getSingleSite().then(
      (site: Home) => {
        this.site = site;
      }
    );
  }

}