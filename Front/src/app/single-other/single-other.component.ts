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
      }
    );
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
    if(this.fileUrl && this.fileUrl !== '') {
      newOther.photo = this.fileUrl;
    }


    const id = this.route.snapshot.params['id'];
    
    // A post entry.
    if(this.fileUrl && this.fileUrl !== ''){
      var postDatas = {
        title: title,
        content: content,
        category: category,
        photo : newOther.photo
      };
    }else if(this.other.photo){
      var postDatasBis = {
        title: title,
        content: content,
        category :category,
        photo : this.other.photo
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
      updates['/Others/' + id] = postDatas;
    }else if(this.other.photo){
      updates['/Others/' + id] = postDatasBis;
    }else{
      updates['/Others/' + id] = postData;
    }
  
    firebase.database().ref().update(updates);

    this.renew();
    this.onChange();
    this.fileUploaded = false;


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

  rmPics(){
    const title = this.otherForm.get('title').value;
    const content = this.otherForm.get('content').value;
    const id = this.route.snapshot.params['id'];
    const category = this.other.category;
    const newOther = new Other();
    newOther.title = title;
    newOther.content = content;
    newOther.category = category;

      var postData = {
        title: title,
        content: content,
        category : category
      }
      
    // Write the new post's data simultaneously in the posts list and the user's post list.
    var updates = {};

      updates['/Others/' + id] = postData;
  
    firebase.database().ref().update(updates);

    this.otherService.removePics(this.other)
    this.renew();
    this.onChange();
    this.fileUploaded = false;

  }


    

}