import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Poem } from 'src/app/models/poem.model'
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
import 'firebase/compat/storage';
import { DataSnapshot } from '@angular/fire/compat/database/interfaces';
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



  private sanitizeId(id: any): number {
    const num = Number(id);
    if (!Number.isInteger(num) || num < 0) {
      throw new Error('Invalid ID');
    }
    return num;
  }

  getSinglePoem(id: number) {
    return new Promise(
      (resolve, reject) => {
        const safeId = this.sanitizeId(id);
        firebase.database().ref('/Poems/' + safeId).once('value').then(
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
    this.poems.push(newPoem);
    this.savePoems();
    this.emitPoems();
  }

  removePoem(poem: Poem) {
    if(poem.photo) {
      const storageRef = firebase.storage().refFromURL(poem.photo);
      storageRef.delete().catch(() => {});
    }
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
          () => {},
          (error) => { reject(error); },
          () => { resolve(upload.snapshot.ref.getDownloadURL()); }
        );
      }
    );
}

uploadAudio(file: File) {
  return new Promise(
    (resolve, reject) => {
      const almostUniqueFileName = Date.now().toString();
      const upload = firebase.storage().ref()
        .child('audio/' + almostUniqueFileName + file.name).put(file);
      upload.on(firebase.storage.TaskEvent.STATE_CHANGED,
        () => {},
        (error) => { reject(error); },
        () => { resolve(upload.snapshot.ref.getDownloadURL()); }
      );
    }
  );
}


removePics(poem : Poem){
  if(poem.photo) {
    const storageRef = firebase.storage().refFromURL(poem.photo);
    storageRef.delete().catch(() => {});
  }
}

removeAudio(poem : Poem){
  if(poem.audio) {
    const storageRef = firebase.storage().refFromURL(poem.audio);
    storageRef.delete().catch(() => {});
  }
}


}
