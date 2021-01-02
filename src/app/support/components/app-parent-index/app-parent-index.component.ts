import { Component, OnInit,Input,DoCheck } from '@angular/core';
import {Title} from "@angular/platform-browser";
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-app-parent-index',
  templateUrl: './app-parent-index.component.html',
  styleUrls: ['./app-parent-index.component.css']
})
export class AppParentIndexComponent implements OnInit,DoCheck {

  @Input() indexTitle: string = 'this is title'; 

  constructor(private titleService:Title,
    private translate: TranslateService) { 
  }

  ngOnInit() {
  }

  ngDoCheck(): void {
    /*this.translate.get(this.indexTitle).subscribe(
      data => {
        this.titleService.setTitle("WD - "+data);
      },
      error => {
      }
    );*/
  }

}
