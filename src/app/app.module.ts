import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { routing, appRoutingProviders } from './app.routing';
import {HttpClient,HttpClientModule} from '@angular/common/http';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import {NgxPaginationModule} from 'ngx-pagination';
import { ClipboardModule } from 'ngx-clipboard';

//Translation
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

//Components
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { WDPROJECT_COMPONENTS,WdProjectRoutingModule } from './components/wdproject';
import { RecoverypassComponent } from './components/recoverypass/recoverypass.component';
import { ChangepassComponent } from './components/changepass/changepass.component';
import { CreateuserComponent } from './components/createuser/createuser.component';

//Services
import { UserService } from './services/user.service';
import { AccesslinkService } from './services/accesslink.service';
import { AlertService } from './services/alert.service';
import { UtilService } from './services/util.service';

//Guards
import {AuthGuard} from './services/auth.guard';
import {LoginGuard} from './services/login.guard';

//Pipes
import {SearchAccessLinkPipe} from './pipes/searchaccesslink.pipe';
import { ShortDateTimePipe } from './pipes/short-date-time.pipe';
import { ShortDatePipe } from './pipes/short-date.pipe';

//Boostrap
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// Importar custom module
import { SupportModule } from './support/support.module';
import { PageheaderComponent } from './components/pageheader/pageheader.component';
import { SearchgenericdataPipe } from './pipes/searchgenericdata.pipe';
import { ConfirmuserComponent } from './components/confirmuser/confirmuser.component';

const COMPONENTS = [
  ...WDPROJECT_COMPONENTS
];

const ROUTES = [
  WdProjectRoutingModule
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    RecoverypassComponent,
    ChangepassComponent,
    CreateuserComponent,
    SearchAccessLinkPipe,
    PageheaderComponent,
    ...COMPONENTS,
    ShortDateTimePipe,
    ShortDatePipe,
    SearchgenericdataPipe,
    ConfirmuserComponent
  ],
  imports: [
    CKEditorModule,
    BrowserModule,
    FormsModule,
    routing,
    HttpClientModule,
    NgbModule,
    SupportModule,
    NgxPaginationModule,
    ClipboardModule,
    TranslateModule.forRoot({
      loader:{
        provide: TranslateLoader,
        useFactory: (http: HttpClient) => {
          return new TranslateHttpLoader(http);
        },
        deps: [ HttpClient ]
      }
    }),
    ...ROUTES
  ],
  providers: [
    appRoutingProviders,
    UserService,
    AccesslinkService,
    AuthGuard,
    LoginGuard,
    AlertService,
    UtilService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
