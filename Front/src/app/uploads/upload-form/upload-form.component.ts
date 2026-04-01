import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-upload-form',
  templateUrl: './upload-form.component.html',
  styleUrls: ['./upload-form.component.css']
})
export class UploadFormComponent implements OnInit{
  filesBis : any[] = [];
  @Input() id : number;
  constructor (){

  }
  ngOnInit(){
  }

  isHovering: boolean;

  files: File[] = [];

  toggleHover(event: any) {
    this.isHovering = event;
  }

  onDrop(files: any) {
    for (let i = 0; i < files.length; i++) {
      this.files.push(files.item(i));
    }
  }
}
