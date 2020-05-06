// Import modulos necesarios para crear modulo
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {HttpClient,HttpClientModule} from '@angular/common/http';

//Translation
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

//Import components
import { ConfirmationdialogComponent } from './components/confirmationdialog/confirmationdialog.component';

//Import Services
import { ConfirmationdialogService } from './services/confirmationdialog.service';

// Decorar ngModule para cargar los componentes y la configuraci�n del modulo
@NgModule({
   imports:[
       CommonModule, 
       FormsModule,
       HttpClientModule,
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
   declarations:[
    ConfirmationdialogComponent
   ],
   providers: [
    ConfirmationdialogService
   ],
   entryComponents: [ 
       ConfirmationdialogComponent 
   ],
   exports: [ConfirmationdialogComponent]
})
export class SupportModule{}