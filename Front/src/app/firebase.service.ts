import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Poem } from 'src/app/models/poem.model'
import * as firebase from 'firebase';
import { DataSnapshot } from '@angular/fire/database/interfaces';
import { Observable } from 'rxjs';
import {HttpClientModule, HttpClient} from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  poems: Array<Poem> = [];
  poemsSubject = new Subject<Poem[]>();
  cats : Array<String> = [];
  catSubject = new Subject<String[]>();

  constructor(private http: HttpClient,) {
    this.getPoems();
   }

  emitPoems(){
    this.poemsSubject.next(this.poems);
  }

  emitCats(cat){
    this.catSubject.next(cat);
    console.log(cat);
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

  createNewPoem(newPoem: Poem) {
    console.log(newPoem);
    this.poems.push(newPoem);
    this.savePoems();
    this.emitPoems();
  }

  removePoem(poem: Poem) {
    if(poem.photo) {
      const storageRef = firebase.storage().refFromURL(poem.photo);
      storageRef.delete().then(
        () => {
          console.log('Photo removed!');
        },
        (error) => {
          console.log('Could not remove photo! : ' + error);
        }
      );
    }
    const poemIndexToRemove = this.poems.findIndex(
      (poemEl) => {
        console.log(poemEl)
        if(poemEl === poem) {
          return true;
        }
      }
    );
    this.poems.splice(poemIndexToRemove, 1);
    this.savePoems();
    this.emitPoems();
  }


  getSingleSite() {
    return new Promise(
      (resolve, reject) => {
        firebase.database().ref('/Site/').once('value').then(
          (data: DataSnapshot) => {
            resolve(data.val());
          }, (error) => {
            reject(error);
          }
        );
      }
    );
  }
  
  getSinglePoemHome(){
    return new Promise(
      (resolve, reject) => {
        firebase.database().ref('/PoemHome/').once('value').then(
          (data: DataSnapshot) => {
            resolve(data.val());
          }, (error) => {
            reject(error);
          }
        );
      }
    );
  }
  

  uploadFile(file: File) {
    return new Promise(
      (resolve, reject) => {
        const almostUniqueFileName = Date.now().toString();
        const upload = firebase.storage().ref()
          .child('images/' + almostUniqueFileName + file.name).put(file);
        upload.on(firebase.storage.TaskEvent.STATE_CHANGED,
          () => {
            console.log('Chargement…');
          },
          (error) => {
            console.log('Erreur de chargement ! : ' + error);
            reject();
          },
          () => {
            resolve(upload.snapshot.ref.getDownloadURL());
          }
        );
      }
    );
}


}
