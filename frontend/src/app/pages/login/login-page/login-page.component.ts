import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {

  form: any = {
    username: null,
    password: null
  };

  roles: String [] = ["Normal", "Admin"];

  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = "Login Failed";

  constructor(private http: HttpClient) {
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    console.log("Username: ", this.form.username, "| Password: ", this.form.password)
    this.http.post<any>('http://167.235.24.74:4000/api/loginVerification', {
      "user": {
        "username": this.form.username,
        "password": this.form.password
      }
    }).subscribe(data => {
      console.log(data);
    })
  }
}
