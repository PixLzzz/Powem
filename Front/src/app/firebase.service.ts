import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Poem } from 'src/app/models/poem.model'
import * as firebase from 'firebase';
import { DataSnapshot } from '@angular/fire/database/interfaces';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  poems: Array<Poem> = [];

  poemsSubject = new Subject<Poem[]>();

  constructor() {
    this.getPoems();
   }

  emitPoems(){
    this.poemsSubject.next(this.poems);
  }

  savePoems() {
    firebase.database().ref('/Poems').set(this.poems);
  }

  getPoems() {
    firebase.database().ref('/Poems')
      .on('value', (data: DataSnapshot) => {
          this.poems = data.val() ? data.val() : [];
          this.emitPoems();
        }
      );
  }

  getSinglePoem(id: number) {
    return new Promise(
      (resolve, reject) => {
        firebase.database().ref('/Poems/' + id).once('value').then(
          (data: DataSnapshot) => {
            resolve(data.val());
          }, (error) => {
            reject(error);
          }
        );
      }
    );
  }

  getPoemContent(id : number){


    return new Promise(
      (resolve, reject) => {
        firebase.database().ref('Poems/' + id).once('value').then(
          (data: DataSnapshot) => {
            resolve(data.val());
          }, (error) => {
            reject(error);
          }
        );
      }
    );


/*
    var contentPoem = firebase.database().ref('Poems/' + id );
    contentPoem.on('value', function(snapshot) {
    var test = snapshot.val().title;
    var tests = snapshot.val().content;
    
    
    console.log(test,tests);
    });*/
  }


  createNewPoem(newPoem: Poem) {
    console.log(newPoem);
    this.poems.push(newPoem);
    this.savePoems();
    this.emitPoems();
  }

  removeBook(poem: Poem) {
    const poemIndexToRemove = this.poems.findIndex(
      (poemEl) => {
        if(poemEl === poem) {
          return true;
        }
      }
    );
    this.poems.splice(poemIndexToRemove, 1);
    this.savePoems();
    this.emitPoems();
  }




}