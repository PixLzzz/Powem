import { Component, OnInit } from '@angular/core';
import { Poem } from '../models/poem.model';
import { Subscription } from 'rxjs';
import { FirebaseService } from '../firebase.service';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-poem-list',
  templateUrl: './poem-list.component.html',
  styleUrls: ['./poem-list.component.css']
})
export class PoemListComponent implements OnInit {
  poems: Poem[];
  poemsSubscription: Subscription;
  displayedColumns: string[] = ['name', 'categories', 'actions'];
  dataSource;
  constructor(private firebaseService: FirebaseService, private router: Router) {
  }

  ngOnInit() {
    this.poemsSubscription = this.firebaseService.poemsSubject.subscribe(
      (poems: Poem[]) => {
        this.poems = poems;
        
      }
    );
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
    console.log(this.poems);
    this.dataSource.filter = filterValue.trim().toLowerCase();
    console.log(this.dataSource)
  }

}
