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
import {SnackBarService} from "../../../core/services/snackbar.service";

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {
  loginForm!: FormGroup;
  registerForm!: FormGroup;

  roles: String [] = ["Normal", "Admin"];

  errorMessage = "Login Failed";
  imageURL = "assets/avatar.jpeg";

  constructor(private http: HttpClient, private fb: FormBuilder, private router: Router,
              @Inject(DOCUMENT) private document: Document, private snackBar: SnackBarService) {
  }

  ngOnInit(): void {
    //Check if user is already logged in. If so redirect to Lobby
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

  /*Executed when user submits login-form.
  * Sends a Http-request to the api if form is valid, otherwise marks invalid fields.
  * On successful login a personal access token and the userid is stored locally.
  * Also the user is redirected to Lobby.*/
  onLogin(): void {
    if (this.loginForm.valid) {
      this.http.post<any>('https://spielehub.server-welt.com/api/loginVerification', {
          "email": this.loginForm.getRawValue()['email'],
          "password": this.loginForm.getRawValue()['password']
        }, {
          observe: "response",
        },
      ).subscribe(response => {
        if (response.status == 200) {
          this.router.navigate(['/lobby']);
          localStorage.setItem('currentUser', JSON.stringify({ token: response.body['token'], userid: response.body['userid'] }));
        }else {
          console.log("HALLOO");
          this.snackBar.showSnackBar('red', 'Wrong credentials!');
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

  /*Executed as user submits the register form.
  * First tries to create and upload the avatar picture if a custom picture is selected.
  * Retrieves an avatar-id to the corresponding entry in database.
  * Sends all register form data together with avatar id to the backend for registration.
  * On successful registration user is redirected to Lobby.*/
  onRegister(): void {
    var avatarID = null;
    if (this.registerForm.valid) {
      if(this.imageURL != 'assets/avatar.jpeg'){
        this.http.post<any>('https://spielehub.server-welt.com/api/createAvatar', {
            "image": this.registerForm.getRawValue()['avatar'],
          }, {
            observe: "response",
          },
        ).subscribe(response => {
          avatarID = response.body['avatarID'];
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
              this.router.navigate(['/lobby']);
            }else {
              this.snackBar.showSnackBar('red', 'Something went wrong!');
            }
          });
        });
      }else {
        this.http.post<any>('https://spielehub.server-welt.com/api/createUser', {
            "email": this.registerForm.getRawValue()['email'],
            "password": this.registerForm.getRawValue()['password'],
            "username": this.registerForm.getRawValue()['userName'],
            "firstname": this.registerForm.getRawValue()['firstname'],
            "surname": this.registerForm.getRawValue()['surname'],
            "avatarID": 0,
          }, {
            observe: "response",
          },
        ).subscribe(response => {
          console.log(response)
          if (response.status == 201) {
            this.router.navigate(['/lobby']);
          }else {
            this.snackBar.showSnackBar('red', 'Something went wrong!');
          }
        });
      }

    } else {
      Object.values(this.registerForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({onlySelf: true});
        }
      });
    }
  }

  /*Loads image from input field and converts it to base64.
  * Also responsible for displaying the image in a small preview.*/
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
