import { Component, OnInit } from '@angular/core';
import { SkillServiceService } from '../skill-service.service';
import { Skill } from '../models/skill.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import * as firebase from 'firebase';
import { DialogComponent } from '../dialog/dialog.component';

import { ViewChild, ElementRef  } from '@angular/core';
import { HttpEventType, HttpErrorResponse } from '@angular/common/http';
import { of, Subscription } from 'rxjs';  
import { catchError, map } from 'rxjs/operators';  
import { UploadService } from  '../upload.service';
import { Files } from '../models/files.model';
import { MatTableDataSource } from '@angular/material/table';



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
  name: string;
  filesOUrl : Array<String> = [];
  filesO: Array<Files> = [];
  filess: String []= [];
  fileToUpload: File = null;
  fileSubscription : Subscription;
  fileForm: FormGroup;
  fileIsUploading = false;
  fileUrl: string;
  fileUploaded = false;
  displayedColumns: string[] = ['name', 'actions'];
  dataFiles : Array<Files> = [];

  constructor(private route: ActivatedRoute, private skillService: SkillServiceService,
              private router: Router,private formBuilder: FormBuilder,public dialog: MatDialog,private uploadService: UploadService) {}

  ngOnInit() {
    this.getDocuments();
    this.filesOUrl = this.uploadService.fileUrl;
    this.filesO = this.uploadService.filesO;
    this.filess = this.uploadService.filesss;
    /*this.fileSubscription = this.uploadService.filesSub.subscribe(
      (files: String[]) => {
        this.filess = files;
        console.log(files);
      }
    );*/
    this.skill = new Skill();
    const id = this.route.snapshot.params['id'];
    this.skillService.getSingleSkill(+id).then(
      (skill: Skill) => {
        this.skill = skill;
        this.skillForm = this.formBuilder.group({
          title: [this.skill.title, Validators.required],
          content: [this.skill.content, Validators.required]
        }); 
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
    this.skillService.removeSkill(skill);
    this.router.navigate(['']);
  }

  updateSkill() {
    const title = this.skillForm.get('title').value;
    const content = this.skillForm.get('content').value;
    const id = this.route.snapshot.params['id'];
    // A post entry.
    var postData = {
      title: title,
      content: content,
    };

    // Write the new post's data simultaneously in the posts list and the user's post list.
    var updates = {};
    updates['/Skills/' + id] = postData;
  
    firebase.database().ref().update(updates);

    this.renew();
    this.onChange();


  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '250px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if(result==1){
        this.deleteSkill(this.skill);
      }
    });
  }

  getDocuments(){
    this.uploadService.getDocs();
    //this.uploadService.getDocsTest();
    
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

detectFiles(event) {
  this.onUploadFile(event.target.files[0]);
}

  

}
