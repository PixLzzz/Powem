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

  async removeSkill(skill: Skill,id) {
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
      element.delete().then(function() {
        console.log("gg")
      }).catch(function(error) {
        console.log(error)
      });
    });
    
  }


}
