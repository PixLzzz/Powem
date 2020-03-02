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
  
  onSavePoem() {
    const title = this.poemForm.get('title').value;
    const content = this.poemForm.get('content').value;
    const category = this.selectedValue;
    console.log(this.selectedValue);
    const newPoem = new Poem();
    newPoem.title = title;
    newPoem.category = category;
    newPoem.content = content;
    this.firebaseService.createNewPoem(newPoem);
    this.router.navigate(['']);
  }

}

interface Category {
  value: string;
  viewValue: string;
}