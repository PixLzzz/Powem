import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable, Subscription } from 'rxjs';
import * as firebase from 'firebase';
import { SkillServiceService } from '../skill-service.service';
import { Skill } from '../models/skill.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-skill',
  templateUrl: './add-skill.component.html',
  styleUrls: ['./add-skill.component.css']
})
export class AddSkillComponent implements OnInit {

  skillForm: FormGroup;
  fileIsUploading = false;
  fileUrl: string;
  fileUploaded = false;
  selectedValue: string;
  id = 0;
  title = 'Ajouter un skill :';
  SkillTitle ;
  SkillCOntent ;
  Skills : Observable<any[]>;
  skills: Skill[];
  poemsSubscription: Subscription;


  constructor(private formBuilder: FormBuilder, private skillService: SkillServiceService,
    private router: Router){}

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.skillForm = this.formBuilder.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      description: ['', Validators.required]
      
    });
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
  
  onSaveSkill() {
    const title = this.skillForm.get('title').value;
    const description = this.skillForm.get('description').value;
    const content = this.skillForm.get('content').value;
    const newSkill = new Skill();
    newSkill.title = title;
    newSkill.content = content;
    newSkill.description =description;
    if(this.fileUrl && this.fileUrl !== '') {
      newSkill.photo = this.fileUrl;
    }
    this.skillService.createNewSkill(newSkill);
    this.router.navigate(['/skillList']);
  }

  detectFiles(event) {
    this.onUploadFile(event.target.files[0]);
  }

}