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
import { Alert } from '../../../models/ui/alertui';
import { WDDataAdd } from '../../../models/ui/wdprojectupdate';
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
  public wdProjectEntity: WDProject = new WDProject();
  public wdDataAddEntity: WDDataAdd = new WDDataAdd();
  public wdProjectEntityToUpdate: WDProject = new WDProject();
  public wdProjectIsNotValidToUpdate: boolean = false;
  public model = {
    id: null
  };
  public filtersearch: string;
  public wdDecodeModel =
    {
      code: "",
      tempCode: null,
      isNotValid: false
    };

  public wdDataIsDecoded = false
  private modalRef;
  private modalDecodeRef;

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
    this.filtersearch = null;
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

  showSection(name: string): Boolean {
    switch (name) {
      case 'wddata_empty':
        return !this.wdProjectEntity.wddata || this.wdProjectEntity.wddata.length == 0
      case 'wddata_results':
        return this.wdProjectEntity.wddata && this.wdProjectEntity.wddata.length > 0;
      default:
        return false;
    }
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

          this.wdProjectEntityToUpdate.name = this.wdProjectEntity.name
          this.wdProjectEntityToUpdate.client = this.wdProjectEntity.client
          this.wdProjectEntityToUpdate.href = this.wdProjectEntity.href
          this.wdProjectEntityToUpdate.status = this.wdProjectEntity.status
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
      case 'onWDDataAdd':
        return this.operationResult.inProgress
      default:
        return false;
    }
  }


  onReload() {
    this.wdDataEncodeValues()
    this.loadData()
  }

  openExternalLink(url: string) {
    if (url) {
      window.open(url, "_blank");
    }
  }

  onCheckboxEncode(e) {
    if (e.target.checked) {
      this.wdDataAddEntity.encode = true;
    } else {
      this.wdDataAddEntity.encode = false;
    }
  }

  onCheckboxIsHref(e) {
    if (e.target.checked) {
      this.wdDataAddEntity.isHref = true;
    } else {
      this.wdDataAddEntity.isHref = false;
    }
  }

  openConfirmationDialog(itemId: string, operation: string) {
    this._confirmationdialogService.confirm(ConfirmationdialogModel.defaultDialog())
      .then((confirmed) => {
        if (confirmed == true) {
          if (operation == 'DELETE_WDDATA') {
            this.deleteItemWdData(itemId);
          }
        }
      })
      .catch(() => { });
  }

  deleteItemWdData(itemId: string) {

    this.operationResult.inProgress = true;

    this._wdprojectService.deleteWDData(this.model.id, { id: itemId }).subscribe(
      response => {
        this.operationResult = this._utilService.processGenericResponse(response);

        if (!this.operationResult.error) {
          this._alertService.showAlert(new Alert("general.message_action_success", "success"));

          this.reloadWDData();
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
          this._alertService.showAlert(new Alert("general.message_action_success", "success"));
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

  wdDataOpenCreatModal(content) {

    this.modalRef = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });

    this.modalRef.result.then((result) => {
      this.wdDataCleanEntityToCreate();
    }, (reason) => {
      this.wdDataCleanEntityToCreate();
    });

  }

  wdDataCloseCreateModel(reason) {
    if (reason === "SAVE" && this.wdDataValidatCreate()) {
      this.wdDataSaveEntityToCreate();
    }

    if (reason === "CLOSE") {
      this.modalRef.dismiss("close");
    }
  }

  wdDataSaveEntityToCreate() {

    var wdWDDataToSave = WDData.instanceToSave(this.wdDataAddEntity.name, this.wdDataAddEntity.value,
      this.wdDataAddEntity.url, this.wdDataAddEntity.isHref, this.wdDataAddEntity.encode);

    this.operationResult.inProgress = true;
    this._wdprojectService.addWDData(this.model.id, wdWDDataToSave).subscribe(
      response => {
        this.operationResult = this._utilService.processGenericResponse(response);

        if (!this.operationResult.error) {
          this.modalRef.close(this.wdDataAddEntity);
          this._alertService.showAlert(new Alert("general.message_action_success", "success"));

          this.reloadWDData()
        }
        else {
          this.modalRef.dismiss("close");
          this._alertService.showAlert(new Alert(this.operationResult.message, "danger"));
        }
      },
      httpError => {
        this.operationResult = this._utilService.processHttpError(httpError);
        this.modalRef.dismiss("close");
        this._alertService.showAlert(new Alert(this.operationResult.message, "danger"));
      }
    );

  }

  wdDataValidatCreate() {
    if (!this.wdDataAddEntity.name) {
      this.wdDataAddEntity.isNotValid = true;
      return false;
    }

    if (!this.wdDataAddEntity.value) {
      this.wdDataAddEntity.isNotValid = true;
      return false;
    }

    this.wdDataAddEntity.isNotValid = false;
    return true;
  }

  wdDataCleanEntityToCreate() {
    this.wdDataAddEntity.name = "";
    this.wdDataAddEntity.value = "";
    this.wdDataAddEntity.url = "";
    this.wdDataAddEntity.isHref = false;
    this.wdDataAddEntity.encode = false;
    this.wdDataAddEntity.isNotValid = false;
  }

  wdDataOpenDecodeModal(content) {

    this.modalDecodeRef = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });

    this.modalDecodeRef.result.then((result) => {
      this.wdDataCleanEntityToDecode();
    }, (reason) => {
      this.wdDataCleanEntityToDecode();
    });

  }

  wdDataCloseDecodeModel(reason) {
    if (reason === "ACCEPT" && this.wdDataValidatDecode()) {
      this.wdDataDecode();
    }

    if (reason === "CLOSE") {
      this.modalDecodeRef.dismiss("close");
    }
  }

  wdDataDecode() {
    this.operationResult.inProgress = true;

    this._wdprojectService.decodeWDData(this.model.id, { code: this.wdDecodeModel.code }).subscribe(
      response => {
        this.operationResult = this._utilService.processGenericResponse(response);

        if (!this.operationResult.error) {
          this.modalDecodeRef.close(this.wdDecodeModel);
          this._alertService.showAlert(new Alert("general.message_action_success", "success"));
          this.wdProjectEntity.wddata = this.operationResult.genericResponse.data;
          this.wdDataIsDecoded = true
          this.wdDecodeModel.tempCode = this.wdDecodeModel.code
        }
        else {
          this.modalDecodeRef.dismiss("close");
          this._alertService.showAlert(new Alert(this.operationResult.message, "danger"));
        }
      },
      httpError => {
        this.operationResult = this._utilService.processHttpError(httpError);
        this.modalDecodeRef.dismiss("close");
        this._alertService.showAlert(new Alert(this.operationResult.message, "danger"));
      }
    );
  }

  wdDataEncodeValues() {
    this.wdDataIsDecoded = false
    this.wdDecodeModel.tempCode = null
  }

  wdDataValidatDecode() {
    if (!this.wdDecodeModel.code || this.wdDecodeModel.code.length == 0) {
      this.wdDecodeModel.isNotValid = true;
      return false;
    }

    this.wdDecodeModel.isNotValid = false;
    return true;
  }

  wdDataCleanEntityToDecode() {
    this.wdDecodeModel.code = "";
    this.wdDecodeModel.isNotValid = false;
  }

  onCheckboxIsActiveProject(e) {
    if (e.target.checked) {
      this.wdProjectEntityToUpdate.status = Status.ACTIVE;
    } else {
      this.wdProjectEntityToUpdate.status = Status.INACTIVE;
    }
  }

  validateWDProjectToUpdate() {
    if (!this.wdProjectEntityToUpdate.name) {
      this.wdProjectIsNotValidToUpdate = true;
      return false;
    }

    this.wdProjectIsNotValidToUpdate = false;
    return true;
  }

  onProjectSave() {

    if (!this.validateWDProjectToUpdate()) {
      return;
    }

    var entityToUpdate = {
      name: this.wdProjectEntityToUpdate.name,
      client: this.wdProjectEntityToUpdate.client,
      status: this.wdProjectEntityToUpdate.status,
      href: this.wdProjectEntityToUpdate.href
    }

    this.operationResult.inProgress = true
    this._wdprojectService.update(this.model.id, entityToUpdate).subscribe(
      response => {
        this.operationResult = this._utilService.processGenericResponse(response);

        if (!this.operationResult.error) {
          this._alertService.showAlert(new Alert("general.message_action_success", "success"));
          this.loadDataProject()
        }
        else {
          this.loadDataCurrentProject()
          this.modalRef.dismiss("close");
          this._alertService.showAlert(new Alert(this.operationResult.message, "danger"));
        }
      },
      httpError => {
        this.loadDataCurrentProject()
        this.operationResult = this._utilService.processHttpError(httpError);
        this._alertService.showAlert(new Alert(this.operationResult.message, "danger"));
      }
    );
  }

  loadDataCurrentProject() {
    this.wdProjectEntityToUpdate.name = this.wdProjectEntity.name
    this.wdProjectEntityToUpdate.client = this.wdProjectEntity.client
    this.wdProjectEntityToUpdate.href = this.wdProjectEntity.href
    this.wdProjectEntityToUpdate.status = this.wdProjectEntity.status
  }

  loadDataProject() {
    this.operationResult.inProgress = true;
    this._wdprojectService.findById(this.model.id).subscribe(
      response => {
        this.operationResult = this._utilService.processGenericResponse(response);

        if (!this.operationResult.error) {
          this.title = this.operationResult.genericResponse.data.name

          this.wdProjectEntity.name = this.operationResult.genericResponse.data.name;
          this.wdProjectEntity.client = this.operationResult.genericResponse.data.client;
          this.wdProjectEntity.href = this.operationResult.genericResponse.data.href;
          this.wdProjectEntity.status = this.operationResult.genericResponse.data.status;


          this.wdProjectEntityToUpdate.name = this.wdProjectEntity.name
          this.wdProjectEntityToUpdate.client = this.wdProjectEntity.client
          this.wdProjectEntityToUpdate.href = this.wdProjectEntity.href
          this.wdProjectEntityToUpdate.status = this.wdProjectEntity.status
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

  reloadWDData() {
    if (this.wdDataIsDecoded && this.wdDecodeModel.tempCode) {
      this.reloadDecodedWDData()
    }
    else {
      this.wdDataEncodeValues()
      this.reloadEncodedWDData()
    }
  }

  reloadDecodedWDData() {
    this.operationResult.inProgress = true;
    this._wdprojectService.decodeWDData(this.model.id, { code: this.wdDecodeModel.tempCode }).subscribe(
      response => {
        this.operationResult = this._utilService.processGenericResponse(response);

        if (!this.operationResult.error) {
          this.wdProjectEntity.wddata = this.operationResult.genericResponse.data;
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

  reloadEncodedWDData() {
    this.operationResult.inProgress = true;
    this._wdprojectService.findById(this.model.id).subscribe(
      response => {
        this.operationResult = this._utilService.processGenericResponse(response);

        if (!this.operationResult.error) {
          this.wdProjectEntity.wddata = this.operationResult.genericResponse.data.wddata;
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

  existsEncodedWDData() {
    if (this.wdProjectEntity.wddata && this.wdProjectEntity.wddata.length > 0) {
      let resultFiltered = this.wdProjectEntity.wddata.filter(x => x.encode == true)
      return (resultFiltered && resultFiltered.length > 0)
    }

    return false
  }

}
