import { Component, OnInit, Input } from '@angular/core';
import { Poem } from '../models/poem.model';
import { Subscription } from 'rxjs';
import { FirebaseService } from '../firebase.service';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { database } from 'firebase';
import { DialogComponent } from '../dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-poem-list',
  templateUrl: './poem-list.component.html',
  styleUrls: ['./poem-list.component.css']
})
export class PoemListComponent implements OnInit {
  poems: Poem[];
  poemsSubscription: Subscription;
  displayedColumns: string[] = ['name', 'categories', 'actions'];
  dataSource ;
  onChange;
  @Input() selectedOption : any;
  constructor(private firebaseService: FirebaseService, private router: Router,public dialog: MatDialog) {
  }

  ngOnInit() {
    this.poemsSubscription = this.firebaseService.poemsSubject.subscribe(
      (poems: Poem[]) => {
        this.poems = poems;
        this.dataSource = new MatTableDataSource(this.poems);
      }
    );
   /* this.onChange = this.selectedOption.subscribe(() => {
      this.catFilter();
 })*/
    this.firebaseService.emitPoems();
  }

  onNewPoem() {
    this.router.navigate(['/addPoem', 'new']);
  }

  onDeletePoem(poem : Poem){
    this.firebaseService.removePoem(poem);
  }

  onViewPoem(id: number) {
    this.router.navigate(['/singlePoem', id]);
  }
  
  ngOnDestroy() {
    this.poemsSubscription.unsubscribe();
  }

  applyFilter(filterValue: string) {
    this.dataSource = new MatTableDataSource(this.poems);
    this.dataSource.filter = filterValue.trim().toLowerCase();

  }

  catFilter(){

    this.dataSource.filter = this.selectedOption.trim().toLowerCase();
    console.log(this.dataSource.filter);
    
  }

  openDialog(poem : Poem): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '250px',
      data: poem
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if(result){
        this.onDeletePoem(result);
      }
    });
  }

}