import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login-page',
  //templateUrl: './login-page.component.html',
  template: `
    <div id="outer">
      <form nz-form [formGroup]="validateForm" class="login-form" (ngSubmit)="onLogin()">
        <nz-form-item>
          <nz-form-control nzErrorTip="Please input your username!">
            <nz-input-group nzPrefixIcon="user">
              <input type="text" nz-input formControlName="userName" placeholder="Email"/>
            </nz-input-group>
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-control nzErrorTip="Please input your Password!">
            <nz-input-group nzPrefixIcon="lock">
              <input type="password" nz-input formControlName="password" placeholder="Password"/>
            </nz-input-group>
          </nz-form-control>
        </nz-form-item>
        <button nz-button class="login-form-button login-form-margin" [nzType]="'primary'">Log in</button>
        Or
        <a>register now!</a>
      </form>
      <form nz-form [formGroup]="validateForm" class="register-form" (ngSubmit)="onRegister()">
        <nz-form-item>
          <nz-form-control nzErrorTip="Please input your username!">
            <nz-input-group nzPrefixIcon="user">
              <input type="text" nz-input formControlName="userName" placeholder="Email"/>
            </nz-input-group>
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-control nzErrorTip="Please input your Password!">
            <nz-input-group nzPrefixIcon="lock">
              <input type="password" nz-input formControlName="password" placeholder="Password"/>
            </nz-input-group>
          </nz-form-control>
        </nz-form-item>
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



  roles: String [] = ["Normal", "Admin"];

  // isLoggedIn = false;
  // isLoginFailed = false;
  errorMessage = "Login Failed";

  constructor(private http: HttpClient, private fb: FormBuilder, private router: Router) {
  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      userName: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  onLogin(): void {
    if (this.validateForm.valid) {
      this.http.post<any>('http://167.235.24.74:4000/api/loginVerification', {
          "email": this.validateForm.getRawValue()['userName'],
          "password": this.validateForm.getRawValue()['password']
        }, {
          headers: new HttpHeaders({
            'authorization': 'Bearer testingStuff'
          }),
          observe: "response",
        },
      ).subscribe(response => {
        if(response.status == 200){
          // this.isLoggedIn = true;
          this.router.navigate(['/game']);
        }
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

  onRegister(): void {

  }
}

/*
*
* import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login-ant-example',
  templateUrl: './login-ant-example.component.html',
  styleUrls: ['./login-ant-example.component.css']
})
export class LoginAntExampleComponent implements OnInit {
  validateForm!: FormGroup;

  submitForm(): void {
    if (this.validateForm.valid) {
      console.log('submit', this.validateForm.value);
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      userName: [null, [Validators.required]],
      password: [null, [Validators.required]],
      remember: [true]
    });
  }
}
*/
