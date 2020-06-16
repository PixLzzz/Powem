import { Component, OnInit } from '@angular/core';
import { SkillServiceService } from '../skill-service.service';
import { Skill } from '../models/skill.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import * as firebase from 'firebase';

import { ViewChild, ElementRef  } from '@angular/core';
import { HttpEventType, HttpErrorResponse } from '@angular/common/http';
import { of, Subscription } from 'rxjs';  
import { catchError, map } from 'rxjs/operators';  
import { UploadService } from  '../upload.service';
import { Files } from '../models/files.model';
import { MatTableDataSource } from '@angular/material/table';
import { DialogSkillComponent } from '../dialog-skill/dialog-skill.component';
import { DialogFileComponent } from '../dialog-file/dialog-file.component';
import { AuthService } from '../auth.service';



@Component({
  selector: 'app-single-skill',
  templateUrl: './single-skill.component.html',
  styleUrls: ['./single-skill.component.css']
})
export class SingleSkillComponent implements OnInit {
  @ViewChild("fileUpload", {static: false}) fileUpload: ElementRef;files  = [];  
  skill: Skill;
  skillForm: FormGroup;
  isCheck = false;
  filess: Files []= [];
  fileSubscription : Subscription;
  id : number;
  user;
  fileIsUploading = false;
  fileUrl: string;
  fileUploaded = false;
  audioIsUploading = false;
  audioUrl: string;
  audioUploaded = false;
  startOffset = 0;
  // Material Style Basic Audio Player Title and Audio URL
  msbapTitle = 'Son';  
  msbapDisplayTitle = false; 
  msbapDisplayVolumeControls = true;  
  autoPlay= true;
  audioSrc="";

  constructor(private route: ActivatedRoute, private skillService: SkillServiceService,
              private router: Router,private formBuilder: FormBuilder,public dialog: MatDialog,private uploadService: UploadService, private auth : AuthService) {}

  ngOnInit() {
    for(let i = 0 ; i< this.filess.length ; i++){
      this.filess.splice(0,1);
    }
    this.user = this.auth.afAuth.user;
    var tempId = this.route.snapshot.paramMap.get("id");
    this.getDocuments(tempId);
    this.id = +tempId;
    this.filess = this.uploadService.files;
    this.skill = new Skill();
    const id = this.route.snapshot.params['id'];
    this.skillService.getSingleSkill(+id).then(
      (skill: Skill) => {
        this.skill = skill;
        this.skillForm = this.formBuilder.group({
          title: [this.skill.title, Validators.required],
          content: [this.skill.content, Validators.required]
        }); 
        this.audioSrc = this.skill.audio;
      }
    );

  }

  onBack() {
    this.router.navigate(['skillList']);
  }
  onChange(){
    this.isCheck = !(this.isCheck);
  }
  renew(){
    const id = this.route.snapshot.params['id'];
    this.skillService.getSingleSkill(+id).then(
      (skill: Skill) => {
        this.skill = skill;
      }
    );
  }

  deleteSkill(skill : Skill){
    this.skillService.removeSkill(skill,this.id);
    this.router.navigate(['skillList']);
  }
  deleteFile(name : string){
    this.uploadService.removeFile(name,this.id);
    this.getDocuments(this.id);
    this.filess = this.uploadService.files;

  }

  updateSkill() {
    const title = this.skillForm.get('title').value;
    const content = this.skillForm.get('content').value;
    const id = this.route.snapshot.params['id'];
    const description = this.skill.description;
    const newSkill = new Skill();
    newSkill.title = title;
    newSkill.content = content;
    newSkill.description = description;
    if(this.fileUrl && this.fileUrl !== '') {
      newSkill.photo = this.fileUrl;
    }
    if(this.audioUrl && this.audioUrl !== '') {
      newSkill.audio = this.audioUrl;
    }
    
     // A post entry.
     if(this.fileUrl && this.fileUrl !== '' && this.audioUrl && this.audioUrl !== ''){
      var postDatas = {
        title: title,
        content: content,
        description : description,
        photo : newSkill.photo,
        audio : newSkill.audio
      };
    }else if(this.skill.photo && this.skill.audio){
      var postDatasBis = {
        title: title,
        content: content,
        description : description,
        photo : this.skill.photo,
        audio : this.skill.audio
      };
      
    }else if(this.skill.photo && this.audioUrl && this.audioUrl !== ''){
      var postDatasBis2 = {
        title: title,
        content: content,
        description :description,
        photo : this.skill.photo,
        audio : newSkill.audio
      };
    }else if(this.fileUrl && this.fileUrl !== '' &&  this.skill.audio){
      var postDatasBis3 = {
        title: title,
        content: content,
        description :description,
        photo : newSkill.photo,
        audio : this.skill.audio
      };
    }else{
      var postData = {
        title: title,
        content: content,
        description: description
      }
    }


    // Write the new post's data simultaneously in the posts list and the user's post list.
    var updates = {};

    if(this.fileUrl && this.fileUrl !== '' && this.audioUrl && this.audioUrl !== ''){
      updates['/Skills/' + id] = postDatas;
    }else if(this.skill.photo && this.skill.audio){
      updates['/Skills/' + id] = postDatasBis;
    }else if(this.skill.photo && this.audioUrl && this.audioUrl !== ''){
      updates['/Skills/' + id] = postDatasBis2;
    }else if(this.fileUrl && this.fileUrl !== '' &&  this.skill.audio){
      updates['/Skills/' + id] = postDatasBis3;
    }else{
      updates['/Skills/' + id] = postData;
    }
  
    firebase.database().ref().update(updates);

    this.renew();
    this.onChange();
    this.fileUploaded = false;


  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogSkillComponent, {
      width: '350px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if(result==1){
        this.deleteSkill(this.skill);
      }
    });
  }

  openDialogFile(name): void {
    const dialogRef = this.dialog.open(DialogFileComponent, {
      width: '350px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if(result==1){
        this.deleteFile(name);
      }
    });
  }

  detectFiles(event) {
    this.onUploadFile(event.target.files[0]);
  }

  detectAudio(event) {
    this.onUploadAudio(event.target.files[0]);
  }

  

  onUploadFile(file: File) {
    this.fileIsUploading = true;
    this.skillService.uploadFile(file).then(
      (url: string) => {
        this.fileUrl = url;
        this.fileIsUploading = false;
        this.fileUploaded = true;
      }
    );

  }

  onUploadAudio(file: File) {
    this.audioIsUploading = true;
    this.skillService.uploadAudio(file).then(
      (url: string) => {
        this.audioUrl = url;
        this.audioIsUploading = false;
        this.audioUploaded = true;
      }
    );

  }


  getDocuments(id){
    this.uploadService.getDocs(id);
  }


  rmPics(){
    const title = this.skillForm.get('title').value;
    const content = this.skillForm.get('content').value;
    const id = this.route.snapshot.params['id'];
    const description = this.skill.description;
    if(this.skill.audio){
      const audio = this.skill.audio;
    }

    const newSkill = new Skill();
    newSkill.title = title;
    newSkill.content = content;
    newSkill.description = description;
    if(this.skill.audio){
      newSkill.audio = this.skill.audio;
    }

      var postData = {
        title: title,
        content: content,
        description : description
      }

      if(this.skill.audio){
        var postDatas = {
          title: title,
          content:content,
          description : description,
          audio: newSkill.audio
        }
      }
      
    // Write the new post's data simultaneously in the posts list and the user's post list.
    var updates = {};

      if(this.skill.audio){
        updates['/Skills/' + id] = postDatas;
      }else{
        updates['/Skills/' + id] = postData;
      }

    firebase.database().ref().update(updates);

    this.skillService.removePics(this.skill)
    this.renew();
    this.onChange();
    this.fileUploaded = false;
  }

  rmAudio(){
    const title = this.skillForm.get('title').value;
    const content = this.skillForm.get('content').value;
    const id = this.route.snapshot.params['id'];
    const description = this.skill.description;
    if(this.skill.photo){
      const photo = this.skill.photo;
    }

    const newSkill = new Skill();
    newSkill.title = title;
    newSkill.content = content;
    newSkill.description = description;
    if(this.skill.photo){
      newSkill.photo = this.skill.photo;
    }

      var postData = {
        title: title,
        content: content,
        description : description
      }

      if(this.skill.photo){
        var postDatas = {
          title: title,
          content:content,
          description : description,
          photo: newSkill.photo
        }
      }
      
    // Write the new post's data simultaneously in the posts list and the user's post list.
    var updates = {};

      if(this.skill.photo){
        updates['/Skills/' + id] = postDatas;
      }else{
        updates['/Skills/' + id] = postData;
      }

    firebase.database().ref().update(updates);

    this.skillService.removeAudio(this.skill)
    this.renew();
    this.onChange();
    this.fileUploaded = false;
  }





}
