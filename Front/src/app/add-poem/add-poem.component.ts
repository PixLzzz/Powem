import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable, Subscription } from 'rxjs';
import * as firebase from 'firebase';
import { FirebaseService } from '../firebase.service';
import { Poem } from '../models/poem.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-poem',
  templateUrl: './add-poem.component.html',
  styleUrls: ['./add-poem.component.css']
})
export class AddPoemComponent implements OnInit {

  poemForm: FormGroup;

  fileIsUploading = false;
  fileUrl: string;
  fileUploaded = false;
  selectedValue: string;
  id = 0;
  title = 'Ajouter un poème :';
  PoemTitle ;
  PoemContent ;
  Poems : Observable<any[]>;
  poems: Poem[];
  poemsSubscription: Subscription;

  category: Category[] = [
    {value: 'Essais', viewValue: 'Essais'},
    {value: 'Coups de cœur', viewValue: 'Coups de cœur'},
    {value: 'En chemin', viewValue: 'En chemin'},
    {value: 'Être', viewValue: 'Être'},
    {value: 'Société', viewValue: 'Société'},
    {value: 'Spiritualité', viewValue: 'Spiritualité'},
    {value: 'Tendresse', viewValue: 'Tendresse'}
  ];

  constructor(private formBuilder: FormBuilder, private firebaseService: FirebaseService,
    private router: Router){
    
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.poemForm = this.formBuilder.group({
      title: ['', Validators.required],
      content: ['', Validators.required]
      
    });
  }

  onUploadFile(file: File) {
    this.fileIsUploading = true;
    this.firebaseService.uploadFile(file).then(
      (url: string) => {
        this.fileUrl = url;
        this.fileIsUploading = false;
        this.fileUploaded = true;
      }
    );
}
  
  onSavePoem() {
    const title = this.poemForm.get('title').value;
    const content = this.poemForm.get('content').value;
    const category = this.selectedValue;
    console.log(this.selectedValue);
    const newPoem = new Poem();
    newPoem.title = title;
    newPoem.category = category;
    newPoem.content = content;
    if(this.fileUrl && this.fileUrl !== '') {
      newPoem.photo = this.fileUrl;
    }
    this.firebaseService.createNewPoem(newPoem);
    this.router.navigate(['poem']);
  }

  detectFiles(event) {
    this.onUploadFile(event.target.files[0]);
  }

}

interface Category {
  value: string;
  viewValue: string;
}