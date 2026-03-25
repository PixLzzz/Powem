import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpEvent, HttpErrorResponse, HttpEventType } from  '@angular/common/http';  
import { map } from  'rxjs/operators';
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';
import { Subject } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Files } from './models/files.model';

@Injectable({
  providedIn: 'root'
})
export class UploadService implements OnInit{
 
  cpt = 0;
  files: Array<Files> = [];
  constructor(private db: AngularFirestore) {
    
   }
   
  ngOnInit(){
    

  }


  async removeFile(name: string, id: number) {
    var storage = firebase.app().storage("gs://powem-98484.appspot.com");
    var storageRef = storage.ref();
    var desertRef = storageRef.child('test/'+ id + '/' + name);

    // Delete the file
    desertRef.delete().catch(() => {});
  }


  async getDocs(id : number){

    this.files.splice(0,this.files.length);
    var name = "";
    var storage = firebase.app().storage("gs://powem-98484.appspot.com");
      var storageRef = storage.ref();
        var listRef = storageRef.child('test/'+ id);
        // Fetch the first page of 100.
        var firstPage = await listRef.list({ maxResults: 100});
        // Use the result.
        firstPage.items.forEach(element => {
          
          
        var urls =  element.getDownloadURL().then((url) => {
          name = element.name;
          var buff = new Files(name,url) ;
          this.files.push(buff);
          
        });
        });
        
        if (firstPage.nextPageToken) {
          var secondPage = await listRef.list({
            maxResults: 100,
            pageToken: firstPage.nextPageToken,
          });
          // processItems(secondPage.items)
          // processPrefixes(secondPage.prefixes)
        }
  
  };
    
  }


