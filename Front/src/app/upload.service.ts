import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpEvent, HttpErrorResponse, HttpEventType } from  '@angular/common/http';  
import { map } from  'rxjs/operators';
import * as firebase from 'firebase';
import { Subject } from 'rxjs';
import { DataSnapshot } from '@angular/fire/database/interfaces';
import { AngularFirestore } from '@angular/fire/firestore';
import { Files } from './models/files.model';

@Injectable({
  providedIn: 'root'
})
export class UploadService implements OnInit{
  cpt = 0;
  fileUrl : Array<String> = [];
  filesss: Array<String> = [];
  files: Array<File> = [];
  filesO: Array<Files> = [];
  filesSubject = new Subject<File[]>();
  aaaaa = "aa";
  filesSub= new Subject<String[]>();
  constructor(private db: AngularFirestore) {
    
   }
  ngOnInit(){
    

  }

  emitFiles(){
    this.filesSubject.next(this.files);
  }


  getSingleFile(id: number) {
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


  getDocs(){
    var storage = firebase.app().storage("gs://powem-98484.appspot.com");
      const ref =  storage.ref('/test');
      ref.listAll().then((res) => {
        res.items.forEach((item) => 
          this.azerty(item.name),
        );
        res.items.forEach((item) =>{
          item.getDownloadURL().then((url)=>{
            this.azerto(url);
          })
        })

      }).catch(function(error) {
        // Uh-oh, an error occurred!
      });
      

      console.log(this.filesss)
  }

  azerty(aaa){

    this.filesss.push(aaa.slice(14));
    this.filesSub.next(aaa.slice(14));
  }
  azerto(aaa){
    this.fileUrl.push(aaa);
  }



  getDocsTest(){

    var storage = firebase.app().storage("gs://powem-98484.appspot.com");
      const ref =  storage.ref('/test');
      ref.listAll().then((res) => {
        res.items.forEach((item) => 
          this.azertyTest(item),
        );
       /* res.items.forEach((item) =>{
          item.getDownloadURL().then((url)=>{
            console.log(url)
            this.azertyTest(url)
          })
        })*/

      }).catch(function(error) {
        // Uh-oh, an error occurred!
      });
      
  }

  azertyTest(str){
    str.getDownloadURL().then((url)=>{
      console.log(url);
      this.filesO[0].url = url;
    })
    console.log(str.name);
    this.filesO[0].name = str.name;
    
    this.cpt = this.cpt +1;
  }








}
