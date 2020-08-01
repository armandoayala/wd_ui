import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RecoverypassComponent } from './components/recoverypass/recoverypass.component';
import { ChangepassComponent } from './components/changepass/changepass.component';
import { CreateuserComponent } from './components/createuser/createuser.component';

import {AuthGuard} from './services/auth.guard';
import {LoginGuard} from './services/login.guard';


//La ruta ** se muestra cuando se encuentra una ruta que no est� configurada, es la por defecto en el
//caso de que el usuario coloque una URL que no existe en la aplicacion
const appRoutes: Routes = [
  {path: '', component: HomeComponent, canActivate:[AuthGuard]},
  {path: '', redirectTo: 'home',pathMatch:'full', canActivate:[AuthGuard]},
  {path:'home',component: HomeComponent, canActivate:[AuthGuard]},
  {path:'login',component: LoginComponent,canActivate:[LoginGuard]},
  {path:'recoverypass',component: RecoverypassComponent,canActivate:[LoginGuard]},
  {path:'changepass',component: ChangepassComponent,canActivate:[LoginGuard]},
  {path:'createuser',component: CreateuserComponent,canActivate:[LoginGuard]},
  {path:'**',component: HomeComponent, canActivate:[AuthGuard]}
];
export const appRoutingProviders:any[]=[];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
