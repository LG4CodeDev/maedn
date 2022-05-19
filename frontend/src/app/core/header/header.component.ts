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
  isVisible: boolean;

  constructor(public router: Router, private http: HttpClient, private snackBar: SnackBarService) {
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  handleCancel() {
    this.isVisible = false;
  }

  handleOk() {
    // let gameID = JSON.parse(localStorage.getItem('currentGame'));
    if(true){
      this.http.put<any>('https://spielehub.server-welt.com/api/leaveGame/' + 125, {}, {
        headers: {
          'authorization': "Bearer " + JSON.parse(localStorage.getItem('currentUser')).token,
        },
        observe: "response",
      },
      ).subscribe(response => {
        if(response.status == 200) {
          this.snackBar.showSnackBar('green', 'Leave successful');
        }else {
          this.snackBar.showSnackBar('red', 'Something went wrong');
        }
      });
    }else {
      this.snackBar.showSnackBar('yellow', 'No ongoing matches');
    }
    this.isVisible = false;
    this.router.navigate(['/lobby']);
  }

  handleNo() {
    this.isVisible = false;
    this.router.navigate(['/lobby']);
  }
}
