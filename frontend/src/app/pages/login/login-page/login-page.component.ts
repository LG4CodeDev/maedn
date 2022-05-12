import {Component, Inject, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {
  AbstractControl,
  AbstractFormGroupDirective,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from "@angular/forms";
import {Router} from "@angular/router";
import {DOCUMENT} from "@angular/common";

@Component({
  selector: 'app-login-page',
  template: `
    <div id="outer">
      <form nz-form [formGroup]="loginForm" id="login-form" class="login-form" (ngSubmit)="onLogin()">
        <nz-form-item>
          <nz-form-control nzErrorTip="Please input your email!">
            <nz-input-group nzPrefixIcon="user">
              <input type="email" nz-input formControlName="email" placeholder="Email"/>
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
        <a (click)="showRegister()">register now!</a>
      </form>
      <form nz-form [formGroup]="registerForm" id="register-form" class="register-form" (ngSubmit)="onRegister()">
        <nz-form-item>
          <div *ngIf="imageURL && imageURL !== ''">
            <img class="imagePreview" [src]="imageURL" [alt]="registerForm.value.name">
          </div>
          <input type="file" accept="image/*" (change)="showPreview($event)" />
        </nz-form-item>
        <nz-form-item>
          <nz-form-control nzErrorTip="Please state your email!">
            <nz-input-group nzPrefixIcon="user">
              <input type="text" nz-input formControlName="email" placeholder="Email"/>
            </nz-input-group>
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-control nzErrorTip="Please choose your username!">
            <nz-input-group nzPrefixIcon="user">
              <input type="text" nz-input formControlName="userName" placeholder="Username"/>
            </nz-input-group>
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-control nzErrorTip="Firstname">
            <nz-input-group>
              <input type="text" nz-input formControlName="firstname" placeholder="Firstname"/>
            </nz-input-group>
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-control nzErrorTip="Surname">
            <nz-input-group>
              <input type="text" nz-input formControlName="surname" placeholder="Surname"/>
            </nz-input-group>
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-control nzErrorTip="Passwords must have at least 4 cahracters.">
            <nz-input-group nzPrefixIcon="lock">
              <input type="password" nz-input formControlName="password" placeholder="Password"/>
            </nz-input-group>
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-control nzErrorTip="Please repeat your Password!">
            <nz-input-group nzPrefixIcon="lock">
              <input type="password" nz-input formControlName="retypePassword" placeholder="Password"/>
            </nz-input-group>
          </nz-form-control>
        </nz-form-item>
        <button nz-button class="register-form-button register-form-margin" [nzType]="'primary'">Register now!</button>
        Or
        <a (click)="showLogin()">login</a>
      </form>
    </div>
  `,
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {
  loginForm!: FormGroup;
  registerForm!: FormGroup;

  roles: String [] = ["Normal", "Admin"];

  errorMessage = "Login Failed";
  imageURL = "assets/avatar.jpeg";

  constructor(private http: HttpClient, private fb: FormBuilder, private router: Router,
              @Inject(DOCUMENT) private document: Document) {
  }

  ngOnInit(): void {
    if(localStorage.getItem('currentUser') != null){
      var currentUser = JSON.parse(localStorage.getItem('currentUser'));
      if(currentUser.token != null && currentUser.token != '' && currentUser.userid != null && currentUser.userid != ''){
        this.router.navigate(['/lobby']);
      }
    }
    this.loginForm = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });

        this.registerForm = this.fb.group({
      avatar: [File],
      email: ['', [Validators.required, Validators.email]],
      userName: ['', [Validators.required]],
      firstname: ['', [Validators.required]],
      surname: ['', [Validators.required]],
      password: ['', [Validators.required]],
      retypePassword: [''],
    });
  }
  onLogin(): void {
    if (this.loginForm.valid) {
      this.http.post<any>('https://spielehub.server-welt.com/api/loginVerification', {
          "email": this.loginForm.getRawValue()['email'],
          "password": this.loginForm.getRawValue()['password']
        }, {
          observe: "response",
        },
      ).subscribe(response => {
        console.log(response);
        if (response.status == 200) {
          this.router.navigate(['/lobby']);
          localStorage.setItem('currentUser', JSON.stringify({ token: response.body['token'], userid: response.body['userid'] }));
        }
      })
    } else {
      Object.values(this.loginForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({onlySelf: true});
        }
      });
    }
  }
  onRegister(): void {
    var avatarID = null;
    if (this.registerForm.valid) {
      this.http.post<any>('https://spielehub.server-welt.com/api/createAvatar', {
          "image": this.registerForm.getRawValue()['avatar'],
        }, {
          observe: "response",
        },
      ).subscribe(response => {
        avatarID = response.body['avatarID'];
      });
      this.http.post<any>('https://spielehub.server-welt.com/api/createUser', {
          "email": this.registerForm.getRawValue()['email'],
          "password": this.registerForm.getRawValue()['password'],
          "username": this.registerForm.getRawValue()['userName'],
          "firstname": this.registerForm.getRawValue()['firstname'],
          "surname": this.registerForm.getRawValue()['surname'],
          "avatarID": avatarID,
        }, {
          observe: "response",
        },
      ).subscribe(response => {
        console.log(response)
        if (response.status == 201) {
          // this.isLoggedIn = true;
          this.router.navigate(['/lobby']);
        }
      });
    } else {
      Object.values(this.registerForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({onlySelf: true});
        }
      });
    }
  }

  showLogin() {
    document.getElementById("login-form").style.display = "block";
    document.getElementById("register-form").style.display = "none";
  }

  showRegister() {
    document.getElementById("login-form").style.display = "none";
    document.getElementById("register-form").style.display = "block";
  }


  showPreview($event: Event) {
    const file = ($event.target as HTMLInputElement).files[0];

    this.registerForm.get('avatar').updateValueAndValidity()
    const reader = new FileReader();
    reader.onload = () => {
      this.imageURL = reader.result as string;
      this.registerForm.patchValue({
        avatar: reader.result
      });
    }
    reader.readAsDataURL(file)
  }
}
