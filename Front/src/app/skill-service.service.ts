import { Injectable, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Skill } from './models/skill.model';
import * as firebase from 'firebase';
import { DataSnapshot } from '@angular/fire/database/interfaces';

@Injectable({
  providedIn: 'root'
})
export class SkillServiceService implements OnInit {

  

  skills: Array<Skill> = [];
  skillsSubject = new Subject<Skill[]>();

  constructor() {
    this.getSkills();
   }
  ngOnInit() {
  }

  emitSkills(){
    this.skillsSubject.next(this.skills);
  }

  saveSkills() {
    firebase.database().ref('/Skills').set(this.skills);
  }

  getSkills() {
    firebase.database().ref('/Skills')
      .on('value', (data: DataSnapshot) => {
          this.skills = data.val() ? data.val() : [];
          this.emitSkills();
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

  getSingleSkill(id: number) {
    return new Promise(
      (resolve, reject) => {
        const safeId = this.sanitizeId(id);
        firebase.database().ref('/Skills/' + safeId).once('value').then(
          (data: DataSnapshot) => {
            resolve(data.val());
          }, (error) => {
            reject(error);
          }
        );
      }
    );
  }

  createNewSkill(newSkill: Skill) {
    this.skills.push(newSkill);
    this.saveSkills();
    this.emitSkills();
  }

  async removeSkill(skill: Skill,id) {
    var cpt= 0;
    if(skill.photo) {
      const storageRef = firebase.storage().refFromURL(skill.photo);
      storageRef.delete().catch(() => {});
    }
    const skillIndexToRemove = this.skills.findIndex(
      (skillEl) => {
        if(skillEl === skill) {
          return true;
        }
      }
    );
    this.skills.splice(skillIndexToRemove, 1);
    this.saveSkills();
    this.emitSkills();

    var storage = firebase.app().storage("gs://powem-98484.appspot.com");
    var storageRef = storage.ref();
      var listRef = storageRef.child('test/'+ id);

    // Delete the file
    var firstPage = await listRef.list({ maxResults: 100});
    // Use the result.
    firstPage.items.forEach(element => {
      element.delete().catch(() => {});
    });
    //this.reOrder(id);
  }

  getSingleSkillHome(){
    return new Promise(
      (resolve, reject) => {
        firebase.database().ref('/SkillHome/').once('value').then(
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
          .child('imagesSkill/' + almostUniqueFileName + file.name).put(file);
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
        .child('audioSkill/' + almostUniqueFileName + file.name).put(file);
      upload.on(firebase.storage.TaskEvent.STATE_CHANGED,
        () => {},
        (error) => { reject(error); },
        () => { resolve(upload.snapshot.ref.getDownloadURL()); }
      );
    }
  );
}


  removePics(skill : Skill){
    if(skill.photo) {
      const storageRef = firebase.storage().refFromURL(skill.photo);
      storageRef.delete().catch(() => {});
    }
  }

  removeAudio(skill : Skill){
    if(skill.audio) {
      const storageRef = firebase.storage().refFromURL(skill.audio);
      storageRef.delete().catch(() => {});
    }
  }

}
