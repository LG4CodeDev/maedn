import {Component, OnInit} from '@angular/core';
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
          <img src="assets/avatar.jpeg" id="profilePicture">
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

  constructor(private http: HttpClient, private router: Router,) {
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
      document.getElementById('username').innerText =
        response.body['username'];
      document.getElementById('user').innerText =
        response.body['wins'];
    });
  }

  getLeaderboard(): void{
    this.http.get<any>('https://spielehub.server-welt.com/api/leaderboard', {
        headers: {
          'authorization': "Bearer " + JSON.parse(localStorage.getItem('currentUser')).token,
        },
        observe: "response",
      },
    ).subscribe(response => {
      console.log(response);
    });
  }
}
