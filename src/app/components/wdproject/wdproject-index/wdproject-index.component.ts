import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';

//Services
import { UserService } from '../../../services/user.service';
import { AlertService } from '../../../services/alert.service';
import { UtilService } from '../../../services/util.service';
import { WdprojectService } from '../../../services/wdproject.service';
import { ConfirmationdialogService } from '../../../support/services/confirmationdialog.service';
import { CONSTANT } from '../../../services/constant';

//Models
import { PageFilter, QueryFilter, GenericFilter } from '../../../models/generic-filter';
import { GenericResponse } from '../../../models/genericresponse';
import { OperationResult } from '../../../models/operationresult';
import { WDProject, WDData } from '../../../models/wdproject';
import { Alert } from '../../../models/ui/alertui';
import { WDProjectCreate } from '../../../models/ui/wdprojectcreate';
import { IndexModel } from '../../../models/ui/index-model';
import { Status } from '../../../models/status';
import { ConfirmationdialogModel } from '../../../support/models/ConfirmationdialogModel';

@Component({
  selector: 'app-wdproject-index',
  templateUrl: './wdproject-index.component.html',
  styleUrls: ['./wdproject-index.component.css']
})
export class WdprojectIndexComponent implements OnInit {

  public title: string
  public indexModel: IndexModel<WDProject> = new IndexModel()

  public genericResponse: GenericResponse
  public operationResult: OperationResult
  public queryFilter: QueryFilter
  public filter: GenericFilter
  public pageFilter: PageFilter

  private modalRef
  public entityToCreate: WDProjectCreate

  constructor(private translate: TranslateService,
    private _userService: UserService,
    private _wdprojectService: WdprojectService,
    private _alertService: AlertService,
    private _utilService: UtilService,
    private _confirmationdialogService: ConfirmationdialogService,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private router: Router) {
    this.title = "page.title_wd_project";
    //this.queryFilter = { status: Status.ACTIVE, query: null, extras: [{ "field_n": "value_filter"}] }
    this.queryFilter = { status: Status.ACTIVE, query: null, extras: [] }
    this.filter = new GenericFilter(this.queryFilter, { name: "asc" })
    this.operationResult = new OperationResult(null, "", false);
    this.entityToCreate = new WDProjectCreate("", "", "", false);
    this.pageFilter = new PageFilter(0, CONSTANT.page_limit)
  }

  ngOnInit(): void {
    this.translate.use(this._userService.getLang());
    this.loadWDProjects();
  }

  loadWDProjects() {
    this.operationResult.inProgress = true;
    this._wdprojectService.findAll(this.filter, this.pageFilter.page, this.pageFilter.limit).subscribe(
      response => {
        this.operationResult = this._utilService.processGenericResponse(response);

        if (!this.operationResult.error) {
          this.indexModel.result = this.operationResult.genericResponse.data.result;
          this.indexModel.hasMore = this.operationResult.genericResponse.data.hasMore;
          this.indexModel.count = this.operationResult.genericResponse.data.count;
        }

      },
      httpError => {

        this.operationResult = this._utilService.processHttpError(httpError);
        this._alertService.showAlert(new Alert(this.operationResult.message, "danger"));
      }
    );

  }

  reloadResults() {
    this.filter.filter = this.queryFilter;
    this.loadWDProjects();
  }

  applyStatusFilter(value: string) {
    this.queryFilter.status = value;
    this.reloadResults();
  }

  onSelectedPageEvent(event) {
    this.pageFilter.page=event.page 
    this.reloadResults()
  }

  showSection(name: string): Boolean {
    switch (name) {
      case 'not_found_results':
        return !this.indexModel.result || this.indexModel.result.length == 0
      case 'results':
        return this.indexModel.result && this.indexModel.result.length > 0;
      case 'loading':
        return this.operationResult.inProgress;
      default:
        return false;
    }
  }

  cleanEntityToCreate() {
    this.entityToCreate.name = "";
    this.entityToCreate.href = "";
    this.entityToCreate.client = "";
    this.entityToCreate.isNotValid = false;
  }

  openCreateModal(content) {

    this.modalRef = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });

    this.modalRef.result.then((result) => {
      this.cleanEntityToCreate();
    }, (reason) => {
      this.cleanEntityToCreate();
    });

  }

  saveEntityToCreate() {
    var wdProjectToSave = WDProject.instanceToSave(this.entityToCreate.name,
      this.entityToCreate.href, this.entityToCreate.client);

    this._wdprojectService.create(wdProjectToSave).subscribe(
      response => {
        this.operationResult = this._utilService.processGenericResponse(response);

        if (!this.operationResult.error) {
          this.modalRef.close(this.entityToCreate);
          this._alertService.showAlert(new Alert("general.message_action_success", "success"));

          this.loadWDProjects()
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
    if (reason === "SAVE" && this.validateCreate()) {
      this.saveEntityToCreate();
    }

    if (reason === "CLOSE") {
      this.modalRef.dismiss("close");
    }
  }

  validateCreate() {
    if (!this.entityToCreate.name) {
      this.entityToCreate.isNotValid = true;
      return false;
    }

    this.entityToCreate.isNotValid = false;
    return true;
  }

  openExternalLink(url: string) {
    if (url) {
      window.open(url, "_blank");
    }
  }

  openConfirmationDialog(itemId: string, operation: string) {
    this._confirmationdialogService.confirm(ConfirmationdialogModel.defaultDialog())
      .then((confirmed) => {
        if (confirmed == true) {
          if (operation == 'DELETE') {
            this.deleteItem(itemId);
          }
          else if (operation == 'ACTIVATE') {
            this.activateItem(itemId);
          }
          else if (operation == 'INACTIVATE') {
            this.inactivateItem(itemId);
          }
        }
      })
      .catch(() => { });
  }

  private deleteItem(itemId: string) {
    this._wdprojectService.delete(itemId).subscribe(
      response => {
        this.operationResult = this._utilService.processGenericResponse(response);

        if (!this.operationResult.error) {
          this._alertService.showAlert(new Alert("general.message_action_success", "success"));

          this.loadWDProjects();
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

  private activateItem(itemId: string) {
    this._wdprojectService.activate(itemId).subscribe(
      response => {
        this.operationResult = this._utilService.processGenericResponse(response);

        if (!this.operationResult.error) {
          this._alertService.showAlert(new Alert("general.message_action_success", "success"));

          this.loadWDProjects();
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

  private inactivateItem(itemId: string) {
    this._wdprojectService.inactivate(itemId).subscribe(
      response => {
        this.operationResult = this._utilService.processGenericResponse(response);

        if (!this.operationResult.error) {
          this._alertService.showAlert(new Alert("general.message_action_success", "success"));

          this.loadWDProjects();
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
