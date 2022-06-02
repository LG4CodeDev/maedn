import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {SnackBarService} from "../services/snackbar.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent  {
  isVisibleGame: boolean;
  isVisibleNoGame: boolean;

  constructor(public router: Router, private http: HttpClient, private snackBar: SnackBarService) {
  }

  /*Redirect to login and clear user data from local storage*/
  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  /*Cancel of back to lobby popups
  * Hides popup.*/
  handleCancel() {
    this.isVisibleGame = false;
    this.isVisibleNoGame = false;
  }

  /*Tries to leave current joined game stored in local storage.
  * Hides popup afterwards.*/
  handleOk() {
    let game = JSON.parse(localStorage.getItem('currentGame')).gameID;
    if(JSON.parse(localStorage.getItem('currentGame')).gameID) {
      this.http.put<any>('https://spielehub.server-welt.com/api/leaveGame/' + game, {}, {
        headers: {
          'authorization': "Bearer " + JSON.parse(localStorage.getItem('currentUser')).token,
        },
        observe: "response",
      },
      ).subscribe(response => {
        if(response.status == 200) {
          localStorage.removeItem('currentGame');
          this.snackBar.showSnackBar('green', 'Leave successful');
        }else {
          this.snackBar.showSnackBar('red', 'Something went wrong');
        }
      });
    }else {
      this.snackBar.showSnackBar('yellow', 'No ongoing matches');
    }
    this.isVisibleGame = false;
    this.isVisibleNoGame = false;
    this.router.navigate(['/lobby']);
  }

  /*Hides back to lobby popup and redirects to lobby without leaving any game.*/
  handleNo() {
    this.isVisibleGame = false;
    this.isVisibleNoGame = false;
    this.router.navigate(['/lobby']);
  }

  /*Shows specific popup based if the user is part of a game or not.*/
  openPopup() {
    if(localStorage.getItem('currentGame')){
      this.isVisibleGame = true;
    }else {
      this.isVisibleNoGame = true;
    }
  }
}
