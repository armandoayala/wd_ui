// Import modulos necesarios para crear modulo
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

//Translation
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

//Import components
import { ConfirmationdialogComponent } from './components/confirmationdialog/confirmationdialog.component';
import { AppParentIndexComponent } from './components/app-parent-index/app-parent-index.component';
import { AppPaginationComponent } from './components/app-pagination/app-pagination.component';

//Import Services
import { ConfirmationdialogService } from './services/confirmationdialog.service';



// Decorar ngModule para cargar los componentes y la configuracion del modulo
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (http: HttpClient) => {
          return new TranslateHttpLoader(http);
        },
        deps: [HttpClient]
      }
    })
  ],
  declarations: [
    ConfirmationdialogComponent,
    AppParentIndexComponent,
    AppPaginationComponent
  ],
  providers: [
    ConfirmationdialogService
  ],
  entryComponents: [
    ConfirmationdialogComponent
  ],
  exports: [ConfirmationdialogComponent,
    AppParentIndexComponent,
    AppPaginationComponent
  ]
})
export class SupportModule { }