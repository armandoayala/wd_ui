import { Component, Input , OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-pageheader',
  templateUrl: './pageheader.component.html',
  styleUrls: ['./pageheader.component.css']
})
export class PageheaderComponent implements OnInit {

  // Guardamos los datos que nos pasa el componente padre
  @Input() public pageTitle: string;

  constructor(private translate: TranslateService) 
  {
      this.pageTitle="TITULO PAGINA";
  }

  ngOnInit() {
  }

}
