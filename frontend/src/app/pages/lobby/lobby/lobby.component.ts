import {Component, Inject, OnInit, Renderer2} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {SnackBarService} from "../../../core/services/snackbar.service";

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent implements OnInit {
  constructor(private http: HttpClient, private router: Router,
              private renderer: Renderer2, private fb: FormBuilder,
              private snackBar: SnackBarService) {
  }

  joinIDForm!: FormGroup;
  token: String;
  userID: number;
  updateAccount!: FormGroup;
  imageURL = "assets/avatar.jpeg";
  isVisible: boolean;

  ngOnInit(): void {
    if(localStorage.getItem('currentUser')){

    }else {
      this.router.navigate(['/login']);
    }
    this.joinIDForm = this.fb.group({
      joinGameID: ['', [Validators.required]],
    });
    this.updateAccount = this.fb.group({
      avatar: [File],
      email: ['', [Validators.required, Validators.email]],
      userName: ['', [Validators.required]],
      firstname: ['', [Validators.required]],
      surname: ['', [Validators.required]],
      password: ['', [Validators.required]],
      retypePassword: [''],
    });
    this.getStats();
    this.getUserInfo();
    this.getLeaderboard();
  }

  get joinGameID() {
    return this.joinIDForm.get('joinGameID') as FormControl;
  }


joinRandom(): void {
    this.http.put<any>('https://spielehub.server-welt.com/api/joinGame', {},{
        headers: {
          'authorization': "Bearer " + JSON.parse(localStorage.getItem('currentUser')).token,
        },
        observe: "response",
      },
    ).subscribe(response => {
      if (response.status == 200) {
        localStorage.setItem('currentGame', JSON.stringify({ gameID: response.body['gameID'] }));
        this.router.navigate(['/game']);
        this.snackBar.showSnackBar('green', 'Successfully joined!');
      }else {
        this.snackBar.showSnackBar('red', 'Error on request!');
      }
    });
  }

  joinID(): void {
    this.http.put<any>('https://spielehub.server-welt.com/api/joinGame/' + this.joinGameID.value, {},{
        headers: {
          'authorization': "Bearer " + JSON.parse(localStorage.getItem('currentUser')).token,
        },
        observe: "response",
      },
    ).subscribe(response => {
      if (response.status == 200) {
        localStorage.setItem('currentGame', JSON.stringify({ gameID: response.body['gameID'] }));
        this.router.navigate(['/game']);
        this.snackBar.showSnackBar('green', 'Successfully joined!');
      }else {
        this.snackBar.showSnackBar('red', 'Error on request!');
      }
    });
  }

  createGame(): void {
    this.http.post<any>('https://spielehub.server-welt.com/api/createMainGame', {}, {
        headers: {
          'authorization': "Bearer " + JSON.parse(localStorage.getItem('currentUser')).token,
        },
        observe: "response",
      },
    ).subscribe(response => {
      if (response.status == 200) {
        localStorage.setItem('currentGame', JSON.stringify({ gameID: response.body['gameID'] }));
        this.router.navigate(['/game']);
        this.snackBar.showSnackBar('green', 'Successfully created!');
      }else {
        this.snackBar.showSnackBar('red', 'Error on request!');
      }
    });
  }

  getStats(): void {
    this.http.get<any>('https://spielehub.server-welt.com/api/getUserStats/' + JSON.parse(localStorage.getItem('currentUser')).userid, {

        headers: {
          'authorization': "Bearer " + JSON.parse(localStorage.getItem('currentUser')).token,
        },
        observe: "response",
      },
    ).subscribe(response => {
      if(response.status == 200){
        document.getElementById('userStatItemLevel').innerText =
          response.body['Level'];
        document.getElementById('userStatItemTotalWins').innerText =
          response.body['wins'];
        document.getElementById('userStatItemTotalGames').innerText =
          response.body['gamesPlayed'];
        document.getElementById('userStatItemWR').innerText =
          response.body['winningRate'];
      }
    });
  }

  getUserInfo(): void {
    this.http.get<any>('https://spielehub.server-welt.com/api/user/' + JSON.parse(localStorage.getItem('currentUser')).userid, {
        headers: {
          'authorization': "Bearer " + JSON.parse(localStorage.getItem('currentUser')).token,
        },
        observe: "response",
      },
    ).subscribe(response => {
      document.getElementById('profilePicture').setAttribute('src', response.body['image']);
      document.getElementById('updateImagePreview').setAttribute('src', response.body['image']);
      document.getElementById('username').innerText =
        response.body['username'];
      this.updateAccount.patchValue({
        avatar: response.body['image'],
        email: response.body['email'],
        userName: response.body['username'],
        firstname: response.body['firstname'],
        surname: response.body['surname'],
      });
    });
  }

  getLeaderboard(): void{
    this.http.get<any>('https://spielehub.server-welt.com/api/mainGame/leaderboard', {
        headers: {
          'authorization': "Bearer " + JSON.parse(localStorage.getItem('currentUser')).token,
        },
        observe: "response",
      },
    ).subscribe(response => {
      this.buildLeaderboard(response.body);
    });
  }

  buildLeaderboard(body: any): void {
    let lb = document.getElementById('leaderboard');
    lb.childNodes.forEach((element) => {
      element.remove();
    })
    let userWrapper = this.renderer.createElement('table');
    userWrapper.classList.add("leaderboardTable");

    let thead = this.renderer.createElement("thead");
    let theadRow = this.renderer.createElement('tr');
    let theadPlace = this.renderer.createElement('td');
    let theadLevel = this.renderer.createElement('td');
    let theadTWins = this.renderer.createElement('td');
    let theadUser = this.renderer.createElement('td');
    let theadWR = this.renderer.createElement('td');
    theadPlace.innerText = "Place";
    theadLevel.innerText = "Level";
    theadTWins.innerText = "Wins";
    theadUser.innerText = "User";
    theadWR.innerText = "W/L";
    theadRow.appendChild(theadPlace);
    theadRow.appendChild(theadUser);
    theadRow.appendChild(theadLevel);
    theadRow.appendChild(theadTWins);
    theadRow.appendChild(theadWR);
    thead.appendChild(theadRow);
    userWrapper.appendChild(thead);

    for(let i = 0; i<Object.keys(body).length; i++){
      let userItemWrapper = this.renderer.createElement('tr');
      userItemWrapper.classList.add("tr");

      let place = this.renderer.createElement('td');
      place.innerText = i+1;
      place.classList.add("td");

      let tusernameWrapper = this.renderer.createElement('td');
      tusernameWrapper.innerText = body[i.toString()]['username'];
      tusernameWrapper.classList.add("td");

      let levelWrapper = this.renderer.createElement('td');
      levelWrapper.innerText = body[i.toString()]['level'];
      levelWrapper.classList.add("td");

      let twinsWrapper = this.renderer.createElement('td');
      twinsWrapper.innerText = body[i.toString()]['wins'];
      twinsWrapper.classList.add("td");

      let WR = this.renderer.createElement('td');
      WR.innerText = body[i.toString()]['winningRate'];
      WR.classList.add("td");

      userItemWrapper.appendChild(place);
      userItemWrapper.appendChild(tusernameWrapper);
      userItemWrapper.appendChild(levelWrapper);
      userItemWrapper.appendChild(twinsWrapper);
      userItemWrapper.appendChild(WR);

      userWrapper.appendChild(userItemWrapper);
    }
    lb.appendChild(userWrapper);
  }

  showPreview($event: Event) {
    const file = ($event.target as HTMLInputElement).files[0];

    this.updateAccount.get('avatar').updateValueAndValidity()
    const reader = new FileReader();
    reader.onload = () => {
      this.imageURL = reader.result as string;
      this.updateAccount.patchValue({
        avatar: reader.result
      });
    }
    reader.readAsDataURL(file)
  }

  showUpdate() {
    document.getElementById("update-form").style.display = "block";
    document.getElementById("userInformation").style.display = "none";
  }

  cancel() {
    document.getElementById("update-form").style.display = "none";
    document.getElementById("userInformation").style.display = "block";
    this.snackBar.showSnackBar('yellow', 'Update canceled!');
  }

  onUpdate() {
    var avatarID = null;
    if (this.updateAccount.valid) {
      this.http.post<any>('https://spielehub.server-welt.com/api/createAvatar', {
          "image": this.updateAccount.getRawValue()['avatar'],
        }, {
        headers: {
          // contentType: "image/png",
        },
          observe: "response",
        },
      ).subscribe(response => {
        avatarID = response.body['avatarID'];
        this.http.put<any>('https://spielehub.server-welt.com/api/updateUser', {
            "id": JSON.parse(localStorage.getItem('currentUser')).userid,
            "email": this.updateAccount.getRawValue()['email'],
            "password": this.updateAccount.getRawValue()['password'],
            "username": this.updateAccount.getRawValue()['userName'],
            "firstname": this.updateAccount.getRawValue()['firstname'],
            "surname": this.updateAccount.getRawValue()['surname'],
            "avatarID": avatarID,
          }, {
            observe: "response",
            headers: {
              'authorization': "Bearer " + JSON.parse(localStorage.getItem('currentUser')).token,
            },
          },
        ).subscribe(response => {
          if (response.status == 200) {
            document.getElementById("update-form").style.display = "none";
            document.getElementById("userInformation").style.display = "block";
            this.snackBar.showSnackBar('green', 'Update successful!');
            this.getUserInfo();
            this.getLeaderboard();
          }
        });
      });
    } else {
      Object.values(this.updateAccount.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({onlySelf: true});
        }
      });
    }
  }

  openDialog() {
    this.isVisible = true;
  }

  handleCancel() {
    this.isVisible = false;
  }

  handleOk() {
    this.joinID();
    this.isVisible = false;
  }
}
