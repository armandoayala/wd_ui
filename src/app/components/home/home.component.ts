import { Component, DoCheck, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

//Services
import { UserService } from '../../services/user.service';
import { AccesslinkService } from '../../services/accesslink.service';
import { AlertService } from '../../services/alert.service';
import { UtilService } from '../../services/util.service';
import { ConfirmationdialogService } from '../../support/services/confirmationdialog.service';

//Models
import { GenericResponse } from '../../models/genericresponse';
import { OperationResult } from '../../models/operationresult';
import { Accesslink } from '../../models/accesslink';
import { AccesslinkFilter } from '../../models/accesslinkfilter';
import { AccesslinkCreate } from '../../models/ui/accesslinkcreate';
import { Alert } from '../../models/ui/alertui';
import { ConfirmationdialogModel } from '../../support/models/ConfirmationdialogModel';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, DoCheck {
  public title:string;
  public genericResponse: GenericResponse;
  public accesslinks: Accesslink[]=[];
  public accesslinkFilter: AccesslinkFilter;
  public operationResult: OperationResult;
  public filtersearch: String;
  public accessLinkEntity: AccesslinkCreate;
  private modalRef;

  constructor(private translate: TranslateService,
    private _userService: UserService,
    private _accessLinkService: AccesslinkService,
    private _alertService: AlertService,
    private _utilService: UtilService,
    private _confirmationdialogService: ConfirmationdialogService,
    private modalService: NgbModal) 
    {
     this.title="page.title_access_link";
     this.accesslinkFilter = new AccesslinkFilter("", true);
     this.operationResult = new OperationResult(null, "", false);
     this.filtersearch = null;
     this.accessLinkEntity = new AccesslinkCreate("", "", "", false);
  }

  ngDoCheck(): void {

  }

  ngOnInit(): void {
    this.translate.use(this._userService.getLang());
    this.getAccesslinks();
  }

  getAccesslinks() {
    this._accessLinkService.findAll(this.accesslinkFilter).subscribe(
      response => {
        this.operationResult = this._utilService.processGenericResponse(response);

        if (!this.operationResult.error) {
          this.accesslinks = this.operationResult.genericResponse.data;
        }

      },
      httpError => {

        this.operationResult = this._utilService.processHttpError(httpError);
        this._alertService.showAlert(new Alert(this.operationResult.message, "danger"));
      }
    );

  }

  cleanAccessLinkEntity() {
    this.accessLinkEntity.title = "";
    this.accessLinkEntity.url = "";
    this.accessLinkEntity.description = "";
    this.accessLinkEntity.isNotValid = false;
  }

  openCreateModal(content) {

    this.modalRef = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });

    this.modalRef.result.then((result) => {
      this.cleanAccessLinkEntity();
    }, (reason) => {
      this.cleanAccessLinkEntity();
    });

  }

  saveAccessLink() {
    var accessLinkToSave = Accesslink.instanceToSave(this.accessLinkEntity.title,
      this.accessLinkEntity.url,
      this.accessLinkEntity.description,
      true);

    this._accessLinkService.createAccessLink(accessLinkToSave).subscribe(
      response => {
        this.operationResult = this._utilService.processGenericResponse(response);

        if (!this.operationResult.error) {
          this.modalRef.close(this.accessLinkEntity);
          this._alertService.showAlert(new Alert("general.message_action_success", "success"));

          var operationResultFindAll = null;
          this._accessLinkService.findAll(this.accesslinkFilter).subscribe(
            responseFindAll => {
              operationResultFindAll = this._utilService.processGenericResponse(responseFindAll);

              if (!operationResultFindAll.error) {
                this.accesslinks = operationResultFindAll.genericResponse.data;
              }

            },
            httpError => {
              operationResultFindAll = this._utilService.processHttpError(httpError);
              this._alertService.showAlert(new Alert(this.operationResult.message, "danger"));
            }
          );
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

  closeCreateModel(reason) {
    if (reason === "SAVE" && this.validateCreateAccessLink()) {
      this.saveAccessLink();
    }

    if (reason === "CLOSE") {
      this.modalRef.dismiss("close");
    }
  }

  validateCreateAccessLink() {
    if (!this.accessLinkEntity.title || !this.accessLinkEntity.url) {
      this.accessLinkEntity.isNotValid = true;
      return false;
    }

    this.accessLinkEntity.isNotValid = false;
    return true;
  }

  public openConfirmationDialog(accessLinkId) {
    this._confirmationdialogService.confirm(ConfirmationdialogModel.defaultDialog())
      .then((confirmed) => {
        if (confirmed == true) {
          this.deleteAccessLink(accessLinkId);
        }
      })
      .catch(() => { });
  }

  private deleteAccessLink(accessLinkId: string) {
    this._accessLinkService.deleteAccessLink(accessLinkId).subscribe(
      response => {
        this.operationResult = this._utilService.processGenericResponse(response);

        if (!this.operationResult.error) {
          this._alertService.showAlert(new Alert("general.message_action_success", "success"));

          var operationResultFindAll = null;
          this._accessLinkService.findAll(this.accesslinkFilter).subscribe(
            responseFindAll => {
              operationResultFindAll = this._utilService.processGenericResponse(responseFindAll);

              if (!operationResultFindAll.error) {
                this.accesslinks = operationResultFindAll.genericResponse.data;
              }

            },
            httpError => {
              operationResultFindAll = this._utilService.processHttpError(httpError);
              this._alertService.showAlert(new Alert(this.operationResult.message, "danger"));
            }
          );

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
