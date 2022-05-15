import {Component, OnInit, Renderer2} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {repeat} from "rxjs/operators";

@Component({
  selector: 'app-lobby',
  template: `
    <div id="lobby" nz-row [nzGutter]="{ xs: 8, sm: 16, md: 24, lg: 32 }">
      <!--      LEADERBOARD-->
      <div id="leaderboard" class="gutter-row" nz-col nzFlex="7">

      </div>
      <!--      END OF LEADERBOARD-->

      <!--      GAME SELECTION-->
      <div id="game_selection" class="gutter-row" nz-col nzFlex="10">
        <div nz-col>
          <div nz-row nzJustify="center">
            <p id="game_headline">Mensch Ärgere Dich (Nicht)</p>
          </div>
          <div nz-row nzJustify="center">
            <button id="create_game" class="game_buttons" (click)="createGame()">
              Create Game
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
          <div nz-row nzJustify="center">
            <button id="join_game" class="game_buttons" (click)="joinRandom()">
              Join Game
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
          <div nz-row nzJustify="center">
            <button id="join_game_id" class="game_buttons" (click)="joinID(1)">
              Join Game with ID
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </div>
      <!--      END OF GAME SELECTION-->

      <!--      STATISTICS-->
      <div id="statistics" class="gutter-row" nz-col nzFlex="7">
        <div nz-row id="userInfo">
          <div nz-col>
            <img src="assets/avatar.jpeg" id="profilePicture">
          </div>
          <div nz-col>
            <p id="username">-</p>
            <p id="user">-</p>
          </div>
        </div>
        <span></span>
        <div nz-row id="userStats">
          <div nz-col style="width: 100%">
            <div class="userStatItem" nz-row nzJustify="space-between"><p>Level:</p><p id="userStatItemLevel" >-</p></div>
            <div class="userStatItem" nz-row nzJustify="space-between"><p>Total wins:</p><p id="userStatItemTotalWins">-</p></div>
            <div class="userStatItem" nz-row nzJustify="space-between"><p>Games played:</p><p id="userStatItemTotalGames">-</p></div>
            <div class="userStatItem" nz-row nzJustify="space-between"><p>Winning rate:</p><p id="userStatItemWR">-</p></div>
          </div>
        </div>
      </div>
      <!--      END OF STATISTICS-->
    </div>
  `,
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent implements OnInit {

  constructor(private http: HttpClient, private router: Router,
              private renderer: Renderer2,) {
  }

  ngOnInit(): void {
    this.getStats();
    this.getUserInfo();
    this.getLeaderboard();
  }

  joinRandom(): void {
    this.http.put<any>('https://spielehub.server-welt.com/api/joinGame', {},{
        headers: {
          'authorization': "Bearer " + JSON.parse(localStorage.getItem('currentUser')).token,
        },
        observe: "response",
      },
    ).subscribe(response => {
      console.log(response)
    });
  }

  joinID(id: number): void {
    this.http.put<any>('https://spielehub.server-welt.com/api/joinGame/' + id, {},{
        headers: {
          'authorization': "Bearer " + JSON.parse(localStorage.getItem('currentUser')).token,
        },
        observe: "response",
      },
    ).subscribe(response => {
      console.log(response)
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
      console.log(response);
      document.getElementById('profilePicture').setAttribute('src', response.body['image']);
      document.getElementById('username').innerText =
        response.body['username'];
      document.getElementById('user').innerText =
        response.body['wins'];
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
      console.log(response);
      this.buildLeaderboard(response.body);
    });
  }

  buildLeaderboard(body: any): void {
    let lb = document.getElementById('leaderboard');
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
    theadTWins.innerText = "Total Wins";
    theadUser.innerText = "User";
    theadWR.innerText = "Win ratio";
    theadRow.appendChild(theadPlace);
    theadRow.appendChild(theadUser);
    theadRow.appendChild(theadLevel);
    theadRow.appendChild(theadTWins);
    theadRow.appendChild(theadWR);
    thead.appendChild(theadRow);
    userWrapper.appendChild(thead);

    for(let i = 0; i<Object.keys(body).length; i++){
      console.log(i+1+".");
      console.log(body[i +  1 + "."]);
      let userItemWrapper = this.renderer.createElement('tr');
      userItemWrapper.classList.add("tr");

      let place = this.renderer.createElement('td');
      place.innerText = i+1;
      // place.classList.add("userStatItem");
      place.classList.add("td");

      let tusernameWrapper = this.renderer.createElement('td');
      tusernameWrapper.innerText = body[i +  1 + "."]['username'];
      // tusernameWrapper.classList.add("userStatItem");
      tusernameWrapper.classList.add("td");

      let levelWrapper = this.renderer.createElement('td');
      levelWrapper.innerText = body[i +  1 + "."]['Level'];
      // levelWrapper.classList.add("userStatItem");
      levelWrapper.classList.add("td");

      let twinsWrapper = this.renderer.createElement('td');
      twinsWrapper.innerText = body[i +  1 + "."]['wins'];
      twinsWrapper.classList.add("userStatItem");
      twinsWrapper.classList.add("td");

      let WR = this.renderer.createElement('td');
      WR.innerText = body[i +  1 + "."]['winningRate'];
      // WR.classList.add("userStatItem");
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
}
