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


  async getDocs(id : number){
    var name = "";
    var storage = firebase.app().storage("gs://powem-98484.appspot.com");

    console.log(id)
      var storageRef = storage.ref();
        var listRef = storageRef.child('test/'+ id);
        // Fetch the first page of 100.
        var firstPage = await listRef.list({ maxResults: 100});
        // Use the result.
        console.log(firstPage.items)
        firstPage.items.forEach(element => {
          
          
        var urls =  element.getDownloadURL().then((url) => {
          name = element.name;
          var buff = new Files(name,url) ;
          this.files.push(buff);
          
        });
        
        console.log(this.files)
        });
        
        if (firstPage.nextPageToken) {
          var secondPage = await listRef.list({
            maxResults: 100,
            pageToken: firstPage.nextPageToken,
          });
          // processItems(secondPage.items)
          // processPrefixes(secondPage.prefixes)
        }
    
      /*for(let x = 0; x <this.files.length; x++){
        this.files.pop();
      }
      ref.listAll().then((res) => {
        res.items.forEach((item) => 
          this.getIntoFiles(item),
        );*/
      

  };

  getIntoFiles(file){
    var buffUrl;
    file.getDownloadURL().then((url)=>{

     buffUrl = url;
    }).then(()=>{
      var buff = new Files(file.name, buffUrl);
      this.files.push(buff);
      this.emitFiles();
      console.log(file)
    })
    
    
  }







}
