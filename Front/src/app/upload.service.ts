import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Files } from './models/files.model';
import { CloudinaryService } from './cloudinary.service';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  cpt = 0;
  files: Array<Files> = [];

  constructor(private db: AngularFirestore, private cloudinary: CloudinaryService) {}

  async removeFile(name: string, id: number) {
    const publicId = `test/${id}/${name}`;
    this.cloudinary.deleteFile(publicId).catch(() => {});
  }

  async getDocs(id: number) {
    this.files.splice(0, this.files.length);
    // Query Firestore for files uploaded to this skill's folder
    const snapshot = await this.db.collection('files', ref =>
      ref.where('path', '>=', `test/${id}/`).where('path', '<=', `test/${id}/\uf8ff`)
    ).get().toPromise();

    if (snapshot) {
      snapshot.docs.forEach(doc => {
        const data = doc.data() as any;
        if (data.downloadURL) {
          const name = data.path ? data.path.split('/').pop() : 'file';
          this.files.push(new Files(name, data.downloadURL));
        }
      });
    }
  }
}
