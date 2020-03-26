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
      content: ['', Validators.required]
      
    });
  }
  
  onSaveSkill() {
    const title = this.skillForm.get('title').value;
    const content = this.skillForm.get('content').value;
    const newSkill = new Skill();
    newSkill.title = title;
    newSkill.content = content;
    this.skillService.createNewSkill(newSkill);
    this.router.navigate(['/skillList']);
  }

}