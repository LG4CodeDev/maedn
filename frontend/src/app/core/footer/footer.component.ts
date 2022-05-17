import {Component, Inject, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {DOCUMENT} from "@angular/common";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  constructor(
    private router: Router,
    @Inject(DOCUMENT) private document: Document,
  ) { }


  ngOnInit(): void {
    document.getElementById('impressumBtn').addEventListener('click', () => {
      this.router.navigate(['/impressum']);
    });
  }

}
