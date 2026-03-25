import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Poem } from 'src/app/models/poem.model'
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
import 'firebase/compat/storage';
import { DataSnapshot } from '@angular/fire/compat/database/interfaces';
import { Observable } from 'rxjs';
import {HttpClientModule, HttpClient} from '@angular/common/http'
import { Other } from './models/other.model';

@Injectable({
  providedIn: 'root'
})
export class OtherService {


  others: Array<Other> = [];
  othersSubject = new Subject<Other[]>();
  cats : Array<String> = [];
  catSubject = new Subject<String[]>();

  constructor(private http: HttpClient,) {
    this.getOthers();
   }

  emitOthers(){
    this.othersSubject.next(this.others);
  }

  emitCats(cat){
    this.catSubject.next(cat);
  }

  saveOthers() {
    firebase.database().ref('/Others').set(this.others);
  }

  getOthers() {
    firebase.database().ref('/Others')
      .on('value', (data: DataSnapshot) => {
          this.others = data.val() ? data.val() : [];
          this.emitOthers();
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

  getSingleOther(id: number) {
    return new Promise(
      (resolve, reject) => {
        const safeId = this.sanitizeId(id);
        firebase.database().ref('/Others/' + safeId).once('value').then(
          (data: DataSnapshot) => {
            resolve(data.val());
          }, (error) => {
            reject(error);
          }
        );
      }
    );
  }

  createNewOther(newOther: Other) {
    this.others.push(newOther);
    this.saveOthers();
    this.emitOthers();
  }

  removeOther(other: Other) {
    if(other.photo) {
      const storageRef = firebase.storage().refFromURL(other.photo);
      storageRef.delete().catch(() => {});
    }
    const otherIndexToRemove = this.others.findIndex(
      (otherEl) => {
        if(otherEl === other) {
          return true;
        }
      }
    );
    this.others.splice(otherIndexToRemove, 1);
    this.saveOthers();
    this.emitOthers();
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


removePics(other : Other){
  if(other.photo) {
    const storageRef = firebase.storage().refFromURL(other.photo);
    storageRef.delete().catch(() => {});
  }
}


removeAudio(other : Other){
  if(other.audio) {
    const storageRef = firebase.storage().refFromURL(other.audio);
    storageRef.delete().catch(() => {});
  }
}




}

