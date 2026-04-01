import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Poem } from 'src/app/models/poem.model'
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
import { DataSnapshot } from '@angular/fire/compat/database/interfaces';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http'
import { CloudinaryService } from './cloudinary.service';
import { Other } from './models/other.model';

@Injectable({
  providedIn: 'root'
})
export class OtherService {


  others: Array<Other> = [];
  othersSubject = new Subject<Other[]>();
  cats : Array<String> = [];
  catSubject = new Subject<String[]>();

  constructor(private http: HttpClient, private cloudinary: CloudinaryService) {
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
      const publicId = this.cloudinary.extractPublicId(other.photo);
      this.cloudinary.deleteFile(publicId).catch(() => {});
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
    return this.cloudinary.uploadFile(file, 'imagesOther');
  }

  uploadAudio(file: File) {
    return this.cloudinary.uploadFile(file, 'audioOther');
  }

  removePics(other: Other) {
    if (other.photo) {
      const publicId = this.cloudinary.extractPublicId(other.photo);
      this.cloudinary.deleteFile(publicId).catch(() => {});
    }
  }

  removeAudio(other: Other) {
    if (other.audio) {
      const publicId = this.cloudinary.extractPublicId(other.audio);
      this.cloudinary.deleteFile(publicId).catch(() => {});
    }
  }




}

