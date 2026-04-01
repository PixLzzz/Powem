import { Injectable, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Skill } from './models/skill.model';
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
import { DataSnapshot } from '@angular/fire/compat/database/interfaces';
import { CloudinaryService } from './cloudinary.service';

@Injectable({
  providedIn: 'root'
})
export class SkillServiceService implements OnInit {

  

  skills: Array<Skill> = [];
  skillsSubject = new Subject<Skill[]>();

  constructor(private cloudinary: CloudinaryService) {
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

  async removeSkill(skill: Skill, id) {
    if (skill.photo) {
      const publicId = this.cloudinary.extractPublicId(skill.photo);
      this.cloudinary.deleteFile(publicId).catch(() => {});
    }
    const skillIndexToRemove = this.skills.findIndex(
      (skillEl) => {
        if (skillEl === skill) {
          return true;
        }
      }
    );
    this.skills.splice(skillIndexToRemove, 1);
    this.saveSkills();
    this.emitSkills();
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
    return this.cloudinary.uploadFile(file, 'imagesSkill');
  }

  uploadAudio(file: File) {
    return this.cloudinary.uploadFile(file, 'audioSkill');
  }

  removePics(skill: Skill) {
    if (skill.photo) {
      const publicId = this.cloudinary.extractPublicId(skill.photo);
      this.cloudinary.deleteFile(publicId).catch(() => {});
    }
  }

  removeAudio(skill: Skill) {
    if (skill.audio) {
      const publicId = this.cloudinary.extractPublicId(skill.audio);
      this.cloudinary.deleteFile(publicId).catch(() => {});
    }
  }

}
