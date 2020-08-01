import { Component, OnInit,Input } from '@angular/core';

@Component({
  selector: 'app-app-parent-index',
  templateUrl: './app-parent-index.component.html',
  styleUrls: ['./app-parent-index.component.css']
})
export class AppParentIndexComponent implements OnInit {

  @Input() indexTitle: string = 'this is title'; 

  constructor() { }

  ngOnInit() {
  }

}
