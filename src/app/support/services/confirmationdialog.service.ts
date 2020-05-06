import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ConfirmationdialogComponent } from '../components/confirmationdialog/confirmationdialog.component';
import { ConfirmationdialogModel } from '../models/ConfirmationdialogModel';


@Injectable({
  providedIn: 'root'
})
export class ConfirmationdialogService {

  constructor(private modalService: NgbModal) { }

  public confirm(
    confirmationdialogConfig:ConfirmationdialogModel): Promise<boolean> {
      
    const modalRef = this.modalService.open(ConfirmationdialogComponent, { size: confirmationdialogConfig.dialogSize });
    modalRef.componentInstance.configDialog = confirmationdialogConfig;

    return modalRef.result;
  }
}
