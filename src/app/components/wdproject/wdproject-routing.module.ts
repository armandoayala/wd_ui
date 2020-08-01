import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WdprojectIndexComponent } from './wdproject-index/wdproject-index.component';
import { WdprojectEditComponent } from './wdproject-edit/wdproject-edit.component';

import { AuthGuard } from '../../services/auth.guard';

const wdprojectRoutes: Routes = [
  {
    path: 'wdproject',
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'index', pathMatch: 'full' },
      { path: 'index', component: WdprojectIndexComponent },
      { path: 'edit/:id', component: WdprojectEditComponent }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(wdprojectRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class WdProjectRoutingModule { }