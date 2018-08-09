import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FileUploader, FileSelectDirective} from 'ng2-file-upload/ng2-file-upload';
const URL = 'http://localhost:3000/api/upload';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  url = '';
  compressurl = '';
  compress1: any = '../assets/uploads/compressed/photo-1532697337090..jpg'
  @ViewChild('fileInput') filess: ElementRef;

  public uploader: FileUploader = new FileUploader(
    {
    url: URL,
    itemAlias: 'photo',
    removeAfterUpload: true,
    }
  );

  ngOnInit() {
    this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; };
    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      console.log('ImageUpload:uploaded:', item, status, response);
      if (response) {
        this.compressurl = `http://localhost:3000/upload/compressed/${JSON.parse(response)['file']}`;
        this.filess.nativeElement.value = '';
        console.log(this.compressurl);
      }
    };
  }

  onSelectFile(event) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event: any) => {
        console.log(event);
        this.url = event.target.result;
      }
    }
  }

}
