import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";

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
            <p id="game_headline">Mensch Ärgere Dich Nicht</p>
          </div>
          <div nz-row nzJustify="center">
            <button id="create_game" class="game_buttons" (click)="sayHello()">
              Create Game
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
          <div nz-row nzJustify="center">
            <button id="join_game" class="game_buttons" (click)="sayHello()">
              Join Game
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
          <div nz-row nzJustify="center">
            <button id="join_game_id" class="game_buttons" (click)="sayHello()">
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

      </div>
      <!--      END OF STATISTICS-->
    </div>
  `,
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent implements OnInit {

  constructor(private http: HttpClient) {
  }

  ngOnInit(): void {
    this.getStats();
  }

  sayHello(): void {
    console.log("Hello");
  }

  getStats(): void {
    console.log(JSON.parse(localStorage.getItem('currentUser')));
    this.http.get<any>('https://spielehub.server-welt.com/api/getUserStats/' + JSON.parse(localStorage.getItem('currentUser')).userid, {

        headers: {
          'authorization': "Bearer " + JSON.parse(localStorage.getItem('currentUser')).token,
        },
        observe: "response",
      },
    ).subscribe(response => {
      console.log(response)
    });
  }


}
