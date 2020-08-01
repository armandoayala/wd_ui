import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

//Services
import { UserService } from '../../../services/user.service';
import { AlertService } from '../../../services/alert.service';
import { UtilService } from '../../../services/util.service';
import { WdprojectService } from '../../../services/wdproject.service';
import { ConfirmationdialogService } from '../../../support/services/confirmationdialog.service';

//Models
import { ExtraFilter, QueryFilter, GenericFilter } from '../../../models/generic-filter';
import { GenericResponse } from '../../../models/genericresponse';
import { OperationResult } from '../../../models/operationresult';
import { WDProject, WDData } from '../../../models/wdproject';
import { Alert } from '../../../models/ui/alertui';
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

  constructor(private translate: TranslateService,
    private _userService: UserService,
    private _wdprojectService: WdprojectService,
    private _alertService: AlertService,
    private _utilService: UtilService,
    private _confirmationdialogService: ConfirmationdialogService) {
    this.title = "page.title_wd_project";
    this.queryFilter = { status: Status.ACTIVE, query: null, extras: [{field:"deletedDate",value:null}] }
    this.filter = new GenericFilter(this.queryFilter, { name: "asc" })
    this.operationResult = new OperationResult(null, "", false);
  }

  ngOnInit(): void {
    this.translate.use(this._userService.getLang());
    this.loadWDProjects();
  }

  loadWDProjects() {
    this.operationResult.inProgress = true;
    this._wdprojectService.findAll(this.filter).subscribe(
      response => {
        this.operationResult = this._utilService.processGenericResponse(response);

        if (!this.operationResult.error) {
          this.indexModel.result = this.operationResult.genericResponse.data.result;
          this.indexModel.hasMore = this.operationResult.genericResponse.data.hasMore;
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

}
