import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import * as firebase from 'firebase';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Poem } from '../models/poem.model';
import { FirebaseService } from '../firebase.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DialogComponent } from '../dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-single-poem',
  templateUrl: './single-poem.component.html',
  styleUrls: ['./single-poem.component.css']
})
export class SinglePoemComponent implements OnInit { 
  poem: Poem;
  poemForm: FormGroup;
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


  constructor(private route: ActivatedRoute, private fireService: FirebaseService,
              private router: Router,private formBuilder: FormBuilder,public dialog: MatDialog) {}

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
        console.log(this.poem)
        this.audioSrc = this.poem.audio;

      }
    );

    this.audioUrl = "";
    this.fileUrl = "";
    
  }

  onBack() {
    this.router.navigate(['poem']);
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

  deletePoem(poem : Poem){
    this.fireService.removePoem(poem);
    this.router.navigate(['poem']);
  }

  updatePoem() {
    const title = this.poemForm.get('title').value;
    const content = this.poemForm.get('content').value;
    const category = this.poem.category;

    const newPoem = new Poem();
    newPoem.title = title;
    newPoem.category = category;
    newPoem.content = content;

    console.log(newPoem)

    if(this.poem.photo){
      newPoem.photo = this.poem.photo;
    }
    if(this.poem.audio){
      newPoem.audio = this.poem.audio;
    }

    if(this.fileUrl && this.fileUrl !== '') {
      newPoem.photo = this.fileUrl;
    }
    if(this.audioUrl && this.audioUrl !== '') {
      newPoem.audio = this.audioUrl;
    }




    const id = this.route.snapshot.params['id'];
    
    // A post entry.
    if(newPoem.photo && newPoem.audio){
      var postDatas = {
        title: title,
        content: content,
        category: category,
        photo : newPoem.photo,
        audio : newPoem.audio
      };
    }else if(newPoem.photo){
      var postDatasBis = {
        title: title,
        content: content,
        category :category,
        photo : newPoem.photo
      };
      
    }else if(newPoem.audio){
      var postDatasBis2 = {
        title: title,
        content: content,
        category :category,
        audio : newPoem.audio
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
    if(newPoem.photo && newPoem.audio){
      updates['/Poems/' + id] = postDatas;
    }else if(newPoem.photo){
      updates['/Poems/' + id] = postDatasBis;
    }else if(newPoem.audio){
      updates['/Poems/' + id] = postDatasBis2;
    }else{
      updates['/Poems/' + id] = postData;
    }
  
    firebase.database().ref().update(updates);

    this.audioUrl= "";
    this.fileUrl= "";
    if(newPoem.audio){
      this.audioSrc = newPoem.audio;
    }
    
    this.renew();
    this.onChange();
    this.fileUploaded = false;
    this.audioUploaded = false;


  }

  openDialog(poem : Poem): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '250px',
      data: poem
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if(result==1){
        this.deletePoem(poem);
        console.log(poem)
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
    this.fireService.uploadFile(file).then(
      (url: string) => {
        this.fileUrl = url;
        this.fileIsUploading = false;
        this.fileUploaded = true;
      }
    );

  }

  onUploadAudio(file: File) {
    this.audioIsUploading = true;
    this.fireService.uploadAudio(file).then(
      (url: string) => {
        this.audioUrl = url;
        this.audioIsUploading = false;
        this.audioUploaded = true;
      }
    );

  }

  rmPics(){
    const title = this.poemForm.get('title').value;
    const content = this.poemForm.get('content').value;
    const id = this.route.snapshot.params['id'];
    const category = this.poem.category;
    if(this.poem.audio){
      const audio = this.poem.audio;
    }
    
    const newPoem = new Poem();
    newPoem.title = title;
    newPoem.content = content;
    newPoem.category = category;
    if(this.poem.audio){
      newPoem.audio = this.poem.audio;
    }

      var postData = {
        title: title,
        content: content,
        category : category
      }
      
      if(this.poem.audio){
        var postDatas = {
          title: title,
          content:content,
          category : category,
          audio: newPoem.audio
        }
      }
    // Write the new post's data simultaneously in the posts list and the user's post list.
    var updates = {};
    
    if(this.poem.audio){
      updates['/Poems/' + id] = postDatas;
    }else{
      updates['/Poems/' + id] = postData;
    }

    firebase.database().ref().update(updates);

    this.fireService.removePics(this.poem)
    this.renew();
    this.onChange();
    this.fileUploaded = false;

  }

  rmAudio(){
    const title = this.poemForm.get('title').value;
    const content = this.poemForm.get('content').value;
    const id = this.route.snapshot.params['id'];
    const category = this.poem.category;
    if(this.poem.photo){
      const photo = this.poem.photo;
    }
    
    const newPoem = new Poem();
    newPoem.title = title;
    newPoem.content = content;
    newPoem.category = category;
    if(this.poem.photo){
      newPoem.photo = this.poem.photo;
    }
    

      var postData = {
        title: title,
        content: content,
        category : category
      }
      
      if(this.poem.photo){
        var postDatas = {
          title: title,
          content:content,
          category : category,
          photo: newPoem.photo
        }
      }
    // Write the new post's data simultaneously in the posts list and the user's post list.
    var updates = {};
    
    if(this.poem.photo){
      updates['/Poems/' + id] = postDatas;
    }else{
      updates['/Poems/' + id] = postData;
    }
    
    firebase.database().ref().update(updates);

    this.fireService.removeAudio(this.poem)
    this.renew();
    this.onChange();
    this.fileUploaded = false;

  }



    

}