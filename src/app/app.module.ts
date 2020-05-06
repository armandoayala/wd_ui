import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { routing, appRoutingProviders } from './app.routing';
import {HttpClient,HttpClientModule} from '@angular/common/http';

//Translation
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

//Components
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';

//Services
import { UserService } from './services/user.service';
import { AccesslinkService } from './services/accesslink.service';
import { AlertService } from './services/alert.service';
import { UtilService } from './services/util.service';

//Guards
import {AuthGuard} from './services/auth.guard';
import {LoginGuard} from './services/login.guard';
import { RecoverypassComponent } from './components/recoverypass/recoverypass.component';
import { ChangepassComponent } from './components/changepass/changepass.component';
import { CreateuserComponent } from './components/createuser/createuser.component';

//Pipes
import {SearchAccessLinkPipe} from './pipes/searchaccesslink.pipe';

//Boostrap
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// Importar custom module
import { SupportModule } from './support/support.module';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    RecoverypassComponent,
    ChangepassComponent,
    CreateuserComponent,
    SearchAccessLinkPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    routing,
    HttpClientModule,
    NgbModule,
    SupportModule,
    TranslateModule.forRoot({
      loader:{
        provide: TranslateLoader,
        useFactory: (http: HttpClient) => {
          return new TranslateHttpLoader(http);
        },
        deps: [ HttpClient ]
      }
    })
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
