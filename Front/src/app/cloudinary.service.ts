import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment } from '../environments/environment';

export interface CloudinaryResponse {
  secure_url: string;
  public_id: string;
  resource_type: string;
  format: string;
  bytes: number;
}

@Injectable({
  providedIn: 'root'
})
export class CloudinaryService {
  private cloudName = environment.cloudinary.cloudName;
  private uploadPreset = environment.cloudinary.uploadPreset;
  private uploadUrl = `https://api.cloudinary.com/v1_1/${this.cloudName}/auto/upload`;

  constructor(private http: HttpClient) {}

  /**
   * Upload a file to Cloudinary (images, audio, video, raw files).
   * Returns a Promise resolving to the secure download URL.
   */
  uploadFile(file: File, folder: string): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', this.uploadPreset);
    formData.append('folder', folder);

    return this.http
      .post<CloudinaryResponse>(this.uploadUrl, formData)
      .toPromise()
      .then(res => res.secure_url);
  }

  /**
   * Upload a file with progress tracking.
   * Returns an object with a progress$ Observable and a result Promise.
   */
  uploadFileWithProgress(file: File, folder: string): {
    progress$: Observable<number>;
    result: Promise<CloudinaryResponse>;
  } {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', this.uploadPreset);
    formData.append('folder', folder);

    const progress$ = new Subject<number>();
    const result = new Promise<CloudinaryResponse>((resolve, reject) => {
      this.http
        .post<CloudinaryResponse>(this.uploadUrl, formData, {
          reportProgress: true,
          observe: 'events'
        })
        .subscribe({
          next: (event) => {
            if (event.type === HttpEventType.UploadProgress && event.total) {
              const pct = Math.round((100 * event.loaded) / event.total);
              progress$.next(pct);
            }
            if (event.type === HttpEventType.Response) {
              progress$.next(100);
              progress$.complete();
              resolve(event.body);
            }
          },
          error: (err) => {
            progress$.error(err);
            reject(err);
          }
        });
    });

    return { progress$: progress$.asObservable(), result };
  }

  /**
   * Extract the public_id from a Cloudinary URL.
   * URL format: https://res.cloudinary.com/{cloud}/{type}/upload/v{ver}/{public_id}.{ext}
   */
  extractPublicId(cloudinaryUrl: string): string {
    if (!cloudinaryUrl || !cloudinaryUrl.includes('res.cloudinary.com')) {
      return '';
    }
    const regex = /\/upload\/v\d+\/(.+)\.\w+$/;
    const match = cloudinaryUrl.match(regex);
    return match ? match[1] : '';
  }

  /**
   * Delete a file via the Cloud Function proxy.
   * Cloudinary doesn't allow unsigned deletes from the client.
   */
  deleteFile(publicId: string): Promise<void> {
    if (!publicId) return Promise.resolve();
    // Calls the Firebase Cloud Function that handles Cloudinary deletion
    return this.http
      .post<any>('https://us-central1-powem-98484.cloudfunctions.net/cloudinaryDelete', { publicId })
      .toPromise()
      .then(() => {});
  }
}
