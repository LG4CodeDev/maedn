import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dsgvo',
  templateUrl: './dsgvo.component.html',
  styleUrls: ['./dsgvo.component.css']
})
export class DsgvoComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    document.getElementById('mailAdress').innerHTML = '<a href="mailto:lg4codedev@gmail.com">lg4codedev@gmail.com</a>';

  }

}
