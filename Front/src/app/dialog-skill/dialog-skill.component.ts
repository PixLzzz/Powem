import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Skill } from '../models/skill.model';

@Component({
  selector: 'app-dialog-skill',
  templateUrl: './dialog-skill.component.html',
  styleUrls: ['./dialog-skill.component.css']
})
export class DialogSkillComponent {


  skill : Skill;
  constructor(
    public dialogRef: MatDialogRef<DialogSkillComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Skill) {
      this.skill = data;
    }

  onNoClick(): void {
    this.dialogRef.close();
  }
  onDelete(){
    
  }

}
