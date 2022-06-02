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
  updateAccount!: FormGroup;
  imageURL = "assets/avatar.jpeg";
  isVisible: boolean;

  ngOnInit(): void {
    /*If there is no user logged in the user should be redirected to the login page*/
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

    /*Initial fill of visible fields*/
    this.getStats();
    this.getUserInfo();
    this.getLeaderboard();
  }

  /*Get entered ID from Form "Join game with ID"*/
  get joinGameID() {
    return this.joinIDForm.get('joinGameID') as FormControl;
  }

/*Calls API to join into a random open game.
* If successful, redirect to gameboard.*/
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

  /*Calls API to join a specific game with a specific previously entered ID.
  * If successful, redirect to gameboard*/
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

  /*Calls API to create a new game and also join the new game.
  * If successful, join the game and redirect to gameboard*/
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

  /*Calls API to get statistical data from current user.
  * Places received data inside of the specific html fields on the right side of the website.*/
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

  /*Calls API to get all available information on the logged in user.
  * Fills the according html fields with available data to display.
  * Also fills the formfields responsible to update the useraccount*/
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

  /*Calls API to get the current leaderboard data*/
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

  /*Responsible for dynamically creating the leaderboard table on the left handed side of the lobby.
  * Fills table with available data.*/
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

  /*Same function as in login-page.
  * Responsible for preview of account image on changes and encoding to base64 string.*/
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

  /*Responsible to show update useraccount form and hide current user info*/
  showUpdate() {
    document.getElementById("update-form").style.display = "block";
    document.getElementById("userInformation").style.display = "none";
  }

  /*Responsible to hide update useraccount form and show user info again*/
  cancel() {
    document.getElementById("update-form").style.display = "none";
    document.getElementById("userInformation").style.display = "block";
    this.snackBar.showSnackBar('yellow', 'Update canceled!');
  }

  /*Called if user submits update account form.
  * Firstly uploads the avater picture and waits for the response with the according avatar id.
  * Tries to update all user data afterwards. Everything will be updated, so every formfield must be filled.
  * On success the update form will be hidden again and all relevant parts where something could have changed like leaderboard and userinfo are updated again.d*/
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

  /*Shows dialog for join game with ID id*/
  openDialog() {
    this.isVisible = true;
  }

  /*Closes dialog of join game with id on cancel button*/
  handleCancel() {
    this.isVisible = false;
  }
  /*Initiates join game with id sequence after dialog submit.
  * Hides dialog again.*/
  handleOk() {
    this.joinID();
    this.isVisible = false;
  }
}
