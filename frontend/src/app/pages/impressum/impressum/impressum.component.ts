import {Component, ElementRef, Inject, OnInit, Renderer2} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {DOCUMENT} from "@angular/common";

@Component({
  selector: 'app-impressum',
  templateUrl: './impressum.component.html',
  styleUrls: ['./impressum.component.css']
})
export class ImpressumComponent implements OnInit {
  constructor(private http: HttpClient,
              private elementRef: ElementRef,
              private renderer: Renderer2,
              private router: Router,
              @Inject(DOCUMENT) private document: Document,) { }

  ngOnInit(): void {
    document.getElementById('names').innerHTML = '<h1 style="color: white;">Impressum</h1>\n' +
      '\n' +
      '<h2 style="color: white;">Angaben gem&auml;&szlig; &sect; 5 TMG</h2>\n' +
      '<p>Max Musterman<br />\n' +
      'Musterstra&szlig;e 3<br />\n' +
      '12345 Musterstadt</p>\n' +
      '\n' +
      '<h2 style="color: white;">Kontakt</h2>\n' +
      '<p class="text">Telefon: 012334567<br />\n' +
      'Telefax: 0123345671<br />\n' +
      'E-Mail: musterman@muster.de</p>\n' +
      '\n' +
      '<p class="text">Quelle: <a href="https://www.e-recht24.de/impressum-generator.html">https://www.e-recht24.de/impressum-generator.html</a></p>';
  }

}
