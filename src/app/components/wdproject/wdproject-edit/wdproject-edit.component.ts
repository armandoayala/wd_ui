import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ChangeEvent, CKEditorComponent } from '@ckeditor/ckeditor5-angular/ckeditor.component';
import { Router, ActivatedRoute } from '@angular/router';

import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

//Services
import { UserService } from '../../../services/user.service';
import { AlertService } from '../../../services/alert.service';
import { UtilService } from '../../../services/util.service';
import { WdprojectService } from '../../../services/wdproject.service';
import { ConfirmationdialogService } from '../../../support/services/confirmationdialog.service';
import { CONSTANT } from '../../../services/constant';

//Models
import { GenericResponse } from '../../../models/genericresponse';
import { OperationResult } from '../../../models/operationresult';
import { WDProject, WDData } from '../../../models/wdproject';
import { WDProjectUpdate } from '../../../models/ui/wdprojectupdate';
import { Alert } from '../../../models/ui/alertui';
import { Status } from '../../../models/status';
import { ConfirmationdialogModel } from '../../../support/models/ConfirmationdialogModel';


@Component({
  selector: 'app-wdproject-edit',
  templateUrl: './wdproject-edit.component.html',
  styleUrls: ['./wdproject-edit.component.css']
})
export class WdprojectEditComponent implements OnInit, AfterViewInit {

  public title: string;
  public Editor = ClassicEditor;
  public editorRef: any;
  public genericResponse: GenericResponse;
  public operationResult: OperationResult;
  public wdProjectEntity: WDProject;
  public wdProjectUpdate: WDProjectUpdate;
  public model = {
    id: null
  };

  constructor(private translate: TranslateService,
    private _userService: UserService,
    private _wdprojectService: WdprojectService,
    private _alertService: AlertService,
    private _utilService: UtilService,
    private _confirmationdialogService: ConfirmationdialogService,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.title = "PROJECT";
    this.operationResult = new OperationResult(null, "", false);
  }

  ngOnInit() {
    this.init();
  }

  ngAfterViewInit() {

  }

  init() {
    ClassicEditor
      .create(document.querySelector('#editor'), {
        toolbar: ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', '|', 'undo', 'redo']
      })
      .then((newEditor) => {
        this.editorRef = newEditor;
        this.model.id = this.route.snapshot.paramMap.get("id");

        if (!this.model.id) {
          this._alertService.showAlert(new Alert("Se debe especificar el id del proyecto", "danger"));
          this.router.navigate(['/wdproject/index']);
        }
        else {
          this.loadData();
        }

      })
      .catch(error => {
        console.log(error);
      });
  }

  loadData() {
    this.operationResult.inProgress = true;
    this._wdprojectService.findById(this.model.id).subscribe(
      response => {
        this.operationResult = this._utilService.processGenericResponse(response);

        if (!this.operationResult.error) {
          this.wdProjectEntity = this.operationResult.genericResponse.data;
          this.title = this.wdProjectEntity.name
          this.editorRef.setData(this.wdProjectEntity.note)
        }
        else {
          this._alertService.showAlert(new Alert(this.operationResult.message, "danger"));
          this.router.navigate(['/wdproject/index']);
        }
      },
      httpError => {

        this.operationResult = this._utilService.processHttpError(httpError);
        this._alertService.showAlert(new Alert(this.operationResult.message, "danger"));
        this.router.navigate(['/wdproject/index']);
      }
    );
  }

  executingAction(name: string): Boolean {
    switch (name) {
      case 'onNoteSave':
        return this.operationResult.inProgress
      case 'onReload':
        return this.operationResult.inProgress
      default:
        return false;
    }
  }


  onReload() {
    this.loadData()
  }

  onNoteSave() {

    if (!this.editorRef) {
      this._alertService.showAlert(new Alert("No reference for editor note", "danger"));
      return;
    }

    this.operationResult.inProgress = true;
    this._wdprojectService.update(this.model.id, { note: this.editorRef.getData() }).subscribe(
      response => {
        this.operationResult = this._utilService.processGenericResponse(response);

        if (!this.operationResult.error) {
          this.wdProjectEntity = this.operationResult.genericResponse.data;
        }
        else {
          this._alertService.showAlert(new Alert(this.operationResult.message, "danger"));
        }
      },
      httpError => {

        this.operationResult = this._utilService.processHttpError(httpError);
        this._alertService.showAlert(new Alert(this.operationResult.message, "danger"));
      }
    );
  }

}
