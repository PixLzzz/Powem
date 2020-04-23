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
      }
    );
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
    if(this.fileUrl && this.fileUrl !== '') {
      newPoem.photo = this.fileUrl;
    }


    const id = this.route.snapshot.params['id'];
    
    // A post entry.
    if(this.fileUrl && this.fileUrl !== ''){
      var postDatas = {
        title: title,
        content: content,
        category: category,
        photo : newPoem.photo
      };
      this.fireService.removePics(this.poem);
    }else if(this.poem.photo){
      var postDatasBis = {
        title: title,
        content: content,
        category :category,
        photo : this.poem.photo
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
    if(this.fileUrl && this.fileUrl !== ''){
      updates['/Poems/' + id] = postDatas;
    }else if(this.poem.photo){
      updates['/Poems/' + id] = postDatasBis;
    }else{
      updates['/Poems/' + id] = postData;
    }
  
    firebase.database().ref().update(updates);

    this.renew();
    this.onChange();
    this.fileUploaded = false;


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

  rmPics(){
    const title = this.poemForm.get('title').value;
    const content = this.poemForm.get('content').value;
    const id = this.route.snapshot.params['id'];
    const category = this.poem.category;
    const newPoem = new Poem();
    newPoem.title = title;
    newPoem.content = content;
    newPoem.category = category;

      var postData = {
        title: title,
        content: content,
        category : category
      }
      
    // Write the new post's data simultaneously in the posts list and the user's post list.
    var updates = {};

      updates['/Poems/' + id] = postData;
  
    firebase.database().ref().update(updates);

    this.fireService.removePics(this.poem)
    this.renew();
    this.onChange();
    this.fileUploaded = false;

  }


    

}