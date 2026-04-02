import { Injectable } from '@angular/core';
import { Files } from './models/files.model';
import { CloudinaryService } from './cloudinary.service';
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  files: Array<Files> = [];

  constructor(private cloudinary: CloudinaryService) {}

  async saveFile(id: number, name: string, downloadURL: string) {
    const fileData = { name, downloadURL };
    await firebase.database().ref(`/SkillFiles/${id}`).push(fileData);
  }

  async removeFile(name: string, id: number) {
    const publicId = `test/${id}/${name}`;
    this.cloudinary.deleteFile(publicId).catch(() => {});
    // Remove from Realtime Database
    const snapshot = await firebase.database().ref(`/SkillFiles/${id}`).once('value');
    const data = snapshot.val();
    if (data) {
      for (const key of Object.keys(data)) {
        if (data[key].name === name) {
          await firebase.database().ref(`/SkillFiles/${id}/${key}`).remove();
          break;
        }
      }
    }
  }

  async getDocs(id: number): Promise<Files[]> {
    const result: Files[] = [];
    const snapshot = await firebase.database().ref(`/SkillFiles/${id}`).once('value');
    const data = snapshot.val();
    if (data) {
      for (const key of Object.keys(data)) {
        const entry = data[key];
        if (entry && entry.downloadURL) {
          result.push(new Files(entry.name || 'file', entry.downloadURL));
        }
      }
    }
    this.files = result;
    return result;
  }
}
