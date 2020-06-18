import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import * as firebase from 'firebase';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Poem } from '../models/poem.model';
import { FirebaseService } from '../firebase.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DialogComponent } from '../dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Other } from '../models/other.model';
import { OtherService } from '../other.service';

@Component({
  selector: 'app-single-other',
  templateUrl: './single-other.component.html',
  styleUrls: ['./single-other.component.css']
})
export class SingleOtherComponent implements OnInit {

  other: Other;
  otherForm: FormGroup;
  isCheck = false;
  animal: string;
  name: string;
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

  constructor(private route: ActivatedRoute, private otherService: OtherService,
              private router: Router,private formBuilder: FormBuilder,public dialog: MatDialog) {}

  ngOnInit() {
    this.other = new Other();
    const id = this.route.snapshot.params['id'];
    this.otherService.getSingleOther(+id).then(
      (other: Other) => {
        this.other = other;
        this.otherForm = this.formBuilder.group({
          title: [this.other.title, Validators.required],
          content: [this.other.content, Validators.required]
        }); 
        this.audioSrc = this.other.audio;
      }
    );
    this.audioUrl = "";
    this.fileUrl = "";
  }

  onBack() {
    this.router.navigate(['other']);
  }
  onChange(){
    this.isCheck = !(this.isCheck);
  }
  renew(){
    const id = this.route.snapshot.params['id'];
    this.otherService.getSingleOther(+id).then(
      (other: Other) => {
        this.other = other;
      }
    );
  }

  deleteOther(other : Other){
    this.otherService.removeOther(other);
    this.router.navigate(['other']);
  }

  updateOther() {
    const title = this.otherForm.get('title').value;
    const content = this.otherForm.get('content').value;
    const category = this.other.category;

    const newOther = new Other();
    newOther.title = title;
    newOther.category = category;
    newOther.content = content;

    if(this.other.photo){
      newOther.photo = this.other.photo;
    }
    if(this.other.audio){
      newOther.audio = this.other.audio;
    }

    if(this.fileUrl && this.fileUrl !== '') {
      newOther.photo = this.fileUrl;
    }
    if(this.audioUrl && this.audioUrl !== '') {
      newOther.audio = this.audioUrl;
    }



    const id = this.route.snapshot.params['id'];

     // A post entry.
     if(newOther.photo && newOther.audio){
      var postDatas = {
        title: title,
        content: content,
        category: category,
        photo : newOther.photo,
        audio : newOther.audio
      };
    }else if(newOther.photo){
      var postDatasBis = {
        title: title,
        content: content,
        category :category,
        photo : newOther.photo
      };
      
    }else if(newOther.audio){
      var postDatasBis2 = {
        title: title,
        content: content,
        category :category,
        audio : newOther.audio
      };
    }else{
      var postData = {
        title: title,
        content: content,
        category: category
      }
    }

    
    // Write the new post's data simultaneously in the posts list and the user's post list.
    var updates = {};
    if(newOther.photo && newOther.audio){
      updates['/Others/' + id] = postDatas;
    }else if(newOther.photo){
      updates['/Others/' + id] = postDatasBis;
    }else if(newOther.audio){
      updates['/Others/' + id] = postDatasBis2;
    }else{
      updates['/Others/' + id] = postData;
    }
  
  
    firebase.database().ref().update(updates);

    this.audioUrl= "";
    this.fileUrl= "";
    if(newOther.audio){
      this.audioSrc = newOther.audio;
    }

    this.renew();
    this.onChange();
    this.fileUploaded = false;
    this.audioUploaded = false;


  }

  openDialog(other : Other): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '250px',
      data: other
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if(result==1){
        this.deleteOther(other);
        console.log(other)
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
    this.otherService.uploadFile(file).then(
      (url: string) => {
        this.fileUrl = url;
        this.fileIsUploading = false;
        this.fileUploaded = true;
      }
    );

  }

  onUploadAudio(file: File) {
    this.audioIsUploading = true;
    this.otherService.uploadAudio(file).then(
      (url: string) => {
        this.audioUrl = url;
        this.audioIsUploading = false;
        this.audioUploaded = true;
      }
    );

  }

  rmPics(){
    const title = this.otherForm.get('title').value;
    const content = this.otherForm.get('content').value;
    const id = this.route.snapshot.params['id'];
    const category = this.other.category;
    if(this.other.audio){
      const audio = this.other.audio;
    }

    const newOther = new Other();
    newOther.title = title;
    newOther.content = content;
    newOther.category = category;
    if(this.other.audio){
      newOther.audio = this.other.audio;
    }

      var postData = {
        title: title,
        content: content,
        category : category
      }

      if(this.other.audio){
        var postDatas = {
          title: title,
          content:content,
          category : category,
          audio: newOther.audio
        }
      }
      
    // Write the new post's data simultaneously in the posts list and the user's post list.
    var updates = {};
    if(this.other.audio){
      updates['/Others/' + id] = postDatas;
    }else{
      updates['/Others/' + id] = postData;
    }
  
    firebase.database().ref().update(updates);

    this.otherService.removePics(this.other)
    this.renew();
    this.onChange();
    this.fileUploaded = false;

  }

  rmAudio(){
    const title = this.otherForm.get('title').value;
    const content = this.otherForm.get('content').value;
    const id = this.route.snapshot.params['id'];
    const category = this.other.category;
    if(this.other.photo){
      const photo = this.other.photo;
    }
    
    const newOther = new Other();
    newOther.title = title;
    newOther.content = content;
    newOther.category = category;
    if(this.other.photo){
      newOther.photo = this.other.photo;
    }
    

      var postData = {
        title: title,
        content: content,
        category : category
      }
      
      if(this.other.photo){
        var postDatas = {
          title: title,
          content:content,
          category : category,
          photo: newOther.photo
        }
      }
    // Write the new post's data simultaneously in the posts list and the user's post list.
    var updates = {};
    
    if(this.other.photo){
      updates['/Others/' + id] = postDatas;
    }else{
      updates['/Others/' + id] = postData;
    }
    
    firebase.database().ref().update(updates);

    this.otherService.removeAudio(this.other)
    this.renew();
    this.onChange();
    this.fileUploaded = false;

  }


    

}