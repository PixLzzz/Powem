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

  getSingleSkill(id: number) {
    return new Promise(
      (resolve, reject) => {
        firebase.database().ref('/Skills/' + id).once('value').then(
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
    console.log(newSkill);
    this.skills.push(newSkill);
    this.saveSkills();
    this.emitSkills();
  }

  removeSkill(skill: Skill) {
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
  }

  uploadFile(file: File) {
    return new Promise(
      (resolve, reject) => {
        const almostUniqueFileName = Date.now().toString();
        const upload = firebase.storage().ref()
          .child('test/' + almostUniqueFileName + file.name).put(file);
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
