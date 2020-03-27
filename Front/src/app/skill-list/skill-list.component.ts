import { Component, OnInit } from '@angular/core';
import { Skill } from '../models/skill.model';
import { Subscription } from 'rxjs';
import { SkillServiceService } from '../skill-service.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-skill-list',
  templateUrl: './skill-list.component.html',
  styleUrls: ['./skill-list.component.css']
})
export class SkillListComponent implements OnInit {

  skills: Skill[];
  skillsSubscription: Subscription;
  displayedColumns: string[] = ['name'];
  dataSource ;
  onChange;

  constructor(private skillService: SkillServiceService, private router: Router,public dialog: MatDialog) {
  }

  ngOnInit() {
    this.skillsSubscription = this.skillService.skillsSubject.subscribe(
      (skills: Skill[]) => {
        this.skills = skills;
        this.dataSource = new MatTableDataSource(this.skills);
      }
    );
   /* this.onChange = this.selectedOption.subscribe(() => {
      this.catFilter();
 })*/
    this.skillService.emitSkills();
  }

  onNewSkill() {
    this.router.navigate(['/addSkill', 'new']);
  }

  onDeleteSkill(skill : Skill){
    this.skillService.removeSkill(skill);
  }

  onViewSkill(id: number) {
    this.router.navigate(['/singleSkill', id]);
  }
  
  ngOnDestroy() {
    this.skillsSubscription.unsubscribe();
  }

  applyFilter(filterValue: string) {
    this.dataSource = new MatTableDataSource(this.skills);
    this.dataSource.filter = filterValue.trim().toLowerCase();

  }

  openDialog(skill : Skill): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '250px',
      data: skill
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if(result){
        this.onDeleteSkill(result);
      }
    });
  }


}
