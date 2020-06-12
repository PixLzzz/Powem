import { Component, OnInit, Input } from '@angular/core';
import { Poem } from '../models/poem.model';
import { Subscription } from 'rxjs';
import { FirebaseService } from '../firebase.service';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { database } from 'firebase';
import { DialogComponent } from '../dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import * as firebase from 'firebase';
import { Other } from '../models/other.model';
import { OtherService } from '../other.service';

@Component({
  selector: 'app-other-list',
  templateUrl: './other-list.component.html',
  styleUrls: ['./other-list.component.css']
})
export class OtherListComponent implements OnInit {

  constructor(private otherService: OtherService, private router: Router,public dialog: MatDialog) {
  }
  others: Other[];
  cats : String[];
  othersSubscription: Subscription;
  catSubscription : Subscription;
  displayedColumns: string[] = ['name', 'categories', 'actions'];
  dataSource ;
  onChange;
  user;
  @Input() selectedOption : any;


  ngOnInit() {
    this.user = firebase.auth().currentUser;
    this.othersSubscription = this.otherService.othersSubject.subscribe(
      (others: Other[]) => {
        this.others = others;
        this.dataSource = new MatTableDataSource(this.others);
      }
    );

    this.catSubscription = this.otherService.catSubject.subscribe(
      (cats: String[]) => {
        this.dataSource = new MatTableDataSource(this.others);
        this.cats = cats;
        console.log(cats);
        this.cats.forEach(x => {
          this.dataSource.filter = x.trim().toLowerCase();
        })
        
      }
    );
   /* this.onChange = this.selectedOption.subscribe(() => {
      this.catFilter();
 })*/
  console.log(this.selectedOption)
    this.otherService.emitOthers();
  }






  onNewOther() {
    this.router.navigate(['/addOther', 'new']);
  }

  onDeleteOther(other : Other){
    this.otherService.removeOther(other);
  }

  onViewOther(id: number) {
    this.router.navigate(['/singleOther', id]);
  }
  
  ngOnDestroy() {
    this.othersSubscription.unsubscribe();
  }

  applyFilter(filterValue: string) {
    this.dataSource = new MatTableDataSource(this.others);
    this.dataSource.filter = filterValue.trim().toLowerCase();

  }

  catFilter(){

    this.dataSource.filter = this.selectedOption.trim().toLowerCase();
    console.log(this.dataSource.filter);
    
  }

  openDialog(other : Other): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '350px',
      data: other
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if(result==1){
        this.onDeleteOther(other);
      }
    });
  }

}