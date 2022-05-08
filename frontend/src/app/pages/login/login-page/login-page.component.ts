import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-login-page',
  //templateUrl: './login-page.component.html',
  template: `
    <div id="outer">
      <form nz-form [formGroup]="validateForm" class="login-form" (ngSubmit)="onSubmit()">
        <nz-form-item>
          <nz-form-control nzErrorTip="Please input your username!">
            <nz-input-group nzPrefixIcon="user">
              <input type="text" nz-input formControlName="userName" placeholder="Username" />
            </nz-input-group>
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-control nzErrorTip="Please input your Password!">
            <nz-input-group nzPrefixIcon="lock">
              <input type="password" nz-input formControlName="password" placeholder="Password" />
            </nz-input-group>
          </nz-form-control>
        </nz-form-item>
        <div nz-row class="login-form-margin">
          <div nz-col [nzSpan]="12">
            <label nz-checkbox formControlName="remember">
              <span>Remember me</span>
            </label>
          </div>
          <div nz-col [nzSpan]="12">
            <a class="login-form-forgot">Forgot password</a>
          </div>
        </div>
        <button nz-button class="login-form-button login-form-margin" [nzType]="'primary'">Log in</button>
        Or
        <a>register now!</a>
      </form>
    </div>
  `,
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {
  validateForm!: FormGroup;

  form: any = {
    username: null,
    password: null
  };

  roles: String [] = ["Normal", "Admin"];

  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = "Login Failed";

  constructor(private http: HttpClient, private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      userName: [null, [Validators.required]],
      password: [null, [Validators.required]],
      remember: [true]
    });
  }

  onSubmit(): void {
    if (this.validateForm.valid) {
      console.log("Username: ", this.form.username, "| Password: ", this.form.password)
      this.http.post<any>('http://167.235.24.74:4000/api/loginVerification', {
          "username": this.form.username,
          "password": this.form.password
        }, {
          headers: new HttpHeaders({
            'authorization': 'Bearer testingStuff'
          })
        }
      ).subscribe(data => {
        console.log(data);
      })
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({onlySelf: true});
        }
      });
    }
  }
}
