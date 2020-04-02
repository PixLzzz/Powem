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
  files: Array<Files> = [];
  filesSubject = new Subject<Files[]>();
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
      for(let x = 0; x <this.files.length; x++){
        this.files.pop();
      }
      
      ref.listAll().then((res) => {
        res.items.forEach((item) => 
          this.azerty(item),
        );
        /*res.items.forEach((item) =>{
          item.getDownloadURL().then((url)=>{
            this.azerto(url);
          })
        })*/

      }).catch(function(error) {
        // Uh-oh, an error occurred!
        console.log(error);
      });
      

  }

  azerty(aaa){
    var buffUrl;
    aaa.getDownloadURL().then((url)=>{

     buffUrl = url;
    }).then(()=>{
      var buff = new Files(aaa.name.slice(14) , buffUrl);
      this.files.push(buff);
      
      this.emitFiles();
    })
    
    
  }







}
