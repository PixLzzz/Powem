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
    var cpt= 0;
    if(skill.photo) {
      const storageRef = firebase.storage().refFromURL(skill.photo);
      storageRef.delete().then(
        () => {
          console.log('Photo removed!');
        },
        (error) => {
          console.log('Could not remove photo! : ' + error);
        }
      );
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
      element.delete().then(function() {
        console.log("gg")
      }).catch(function(error) {
        console.log(error)
      });
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
        .child('audioSkill/' + almostUniqueFileName + file.name).put(file);
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


  removePics(skill : Skill){
    if(skill.photo) {
      const storageRef = firebase.storage().refFromURL(skill.photo);
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

  removeAudio(skill : Skill){
    if(skill.audio) {
      const storageRef = firebase.storage().refFromURL(skill.audio);
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
