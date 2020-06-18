import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Poem } from 'src/app/models/poem.model'
import * as firebase from 'firebase';
import { DataSnapshot } from '@angular/fire/database/interfaces';
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
    console.log(cat);
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



  getSingleOther(id: number) {
    return new Promise(
      (resolve, reject) => {
        firebase.database().ref('/Others/' + id).once('value').then(
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
    console.log(newOther);
    this.others.push(newOther);
    this.saveOthers();
    this.emitOthers();
  }

  removeOther(other: Other) {
    if(other.photo) {
      const storageRef = firebase.storage().refFromURL(other.photo);
      storageRef.delete().then(
        () => {
          console.log('Photo removed!');
        },
        (error) => {
          console.log('Could not remove photo! : ' + error);
        }
      );
    }
    const otherIndexToRemove = this.others.findIndex(
      (otherEl) => {
        console.log(otherEl)
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

uploadAudio(file: File) {
  return new Promise(
    (resolve, reject) => {
      const almostUniqueFileName = Date.now().toString();
      const upload = firebase.storage().ref()
        .child('audio/' + almostUniqueFileName + file.name).put(file);
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




removePics(other : Other){
  if(other.photo) {
    const storageRef = firebase.storage().refFromURL(other.photo);
    storageRef.delete().then(
      () => {
        console.log('Photo removed!');
      },
      (error) => {
        console.log('Could not remove photo! : ' + error);
      }
    );
  }
}


removeAudio(other : Other){
  if(other.audio) {
    const storageRef = firebase.storage().refFromURL(other.audio);
    storageRef.delete().then(
      () => {
        console.log('Audio removed!');
      },
      (error) => {
        console.log('Could not remove audio! : ' + error);
      }
    );
  }
}




}

