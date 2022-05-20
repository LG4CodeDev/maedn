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
      '<p>Benjamin Arp, Max Dürr, Tomasz Kania, Alexander Schulte und Anton Utz<br />\n' +
      'Rotebühlplatz 41<br />\n' +
      '70178 Stuttgart</p>\n' +
      '\n' +
      '<h2 style="color: white;">Kontakt</h2>\n' +
      '<p class="text">Tel. +49 711 1849 4513<br />\n' +
      'Fax +49 711 1849 4510<br />\n' +
      'E-Mail: <a href="mailto:lg4codedev@gmail.com">lg4codedev@gmail.com</a> <br />\n' +
      '\n' +
      '<p class="text">Quelle: <a href="https://www.e-recht24.de/impressum-generator.html">https://www.e-recht24.de/impressum-generator.html</a></p>';
  }

}
