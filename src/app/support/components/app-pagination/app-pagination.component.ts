import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './app-pagination.component.html',
  styleUrls: ['./app-pagination.component.css']
})
export class AppPaginationComponent implements OnInit {

  @Input() total: number = 0;
  @Input() sizePage: number = 0;
  public pages: number = 0;
  public numbers: number[] = [];
  public lastPageSelected: number = 0;
  @Output() onSelectedPage = new EventEmitter();

  constructor() { }

  ngOnInit() {
    this.calculatePages()
  }

  calculatePages() {

    if (this.sizePage == 0) {
      this.numbers = [];
      return;
    }

    this.pages = Math.round(this.total / this.sizePage)

    if (this.pages > 0) {
      this.numbers = Array(this.pages).fill(0).map((x, i) => i);
    }
    else {
      this.numbers = [];
    }
  }

  sendOnSelectEvent(page) {
    this.lastPageSelected = page;

    this.onSelectedPage.emit({
      'page': page
    });
  }

  sendOnSelectEventPrevius() {
    if (this.lastPageSelected > 0) {
      this.lastPageSelected = this.lastPageSelected - 1;
    }

    this.onSelectedPage.emit({
      'page': this.lastPageSelected
    });
  }

  sendOnSelectEventNext() {
    if (this.lastPageSelected < (this.pages - 1)) {
      this.lastPageSelected = this.lastPageSelected + 1;
    }

    this.onSelectedPage.emit({
      'page': this.lastPageSelected
    });
  }



}
