import { Component, OnInit, Input } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, of } from 'rxjs';
import { CloudinaryService } from '../../cloudinary.service';

@Component({
    selector: 'app-upload-list',
    templateUrl: './upload-list.component.html',
    styleUrls: ['./upload-list.component.css'],
    standalone: false
})
export class UploadListComponent implements OnInit {

  @Input() file: File | any;
  @Input() fileB: File | any;
  @Input() id: number;

  percentage: Observable<number>;
  downloadURL: string;
  uploading = true;

  constructor(private cloudinary: CloudinaryService, private db: AngularFirestore) { }

  ngOnInit() {
    this.startUpload(this.id);
  }

  startUpload(id) {
    const folder = 'test/' + id;
    const { progress$, result } = this.cloudinary.uploadFileWithProgress(this.file, folder);

    this.percentage = progress$;

    result.then(res => {
      this.downloadURL = res.secure_url;
      this.uploading = false;
      this.db.collection('files').add({ downloadURL: this.downloadURL, path: folder + '/' + this.file.name });
    }).catch(() => {
      this.uploading = false;
    });
  }
}
