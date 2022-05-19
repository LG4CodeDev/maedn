import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SnackBarService {

  constructor() {
  }


  showSnackBar(color: String, message: string) {
    var x = document.getElementById("snackbar");
    x.className = color +" show";
    x.innerText = message;
    setTimeout(function(){ x.className = x.className.replace(color +" show", ""); }, 3000);
  }
}
