import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Skill } from '../models/skill.model';
import { Files } from '../models/files.model';

@Component({
  selector: 'app-dialog-file',
  templateUrl: './dialog-file.component.html',
  styleUrls: ['./dialog-file.component.css']
})
export class DialogFileComponent {


  file : Files;
  constructor(
    public dialogRef: MatDialogRef<DialogFileComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Files) {
      this.file = data;
    }

  onNoClick(): void {
    this.dialogRef.close();
  }
  onDelete(){
    
  }




}
