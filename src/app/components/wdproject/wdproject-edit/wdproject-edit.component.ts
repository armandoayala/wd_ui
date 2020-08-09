import { Component, OnInit } from '@angular/core';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'app-wdproject-edit',
  templateUrl: './wdproject-edit.component.html',
  styleUrls: ['./wdproject-edit.component.css']
})
export class WdprojectEditComponent implements OnInit {

  public title: string;
  public Editor = ClassicEditor;
  public model = {
    editorData: '<p>Hello, world!</p>'
  };

  constructor() {
    this.title = "PROJECT - NAME";

  }

  ngOnInit() {
    this.init();
  }

  init() {
    ClassicEditor
      .create(document.querySelector('#editor'), {
        toolbar: ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', '|', 'undo', 'redo']
      })
      .then(() => {
        //Cargar data from DataBase
        console.log("Inicio correcto");
      })
      .catch(error => {
        console.log(error);
      });
  }

  onSave() {
    console.log(this.model.editorData)
  }

}
