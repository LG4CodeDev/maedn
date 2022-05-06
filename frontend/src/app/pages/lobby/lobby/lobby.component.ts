import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-lobby',
  template: `
    <div id="lobby" nz-row [nzGutter]="{ xs: 8, sm: 16, md: 24, lg: 32 }">
<!--      LEADERBOARD-->
      <div id="leaderboard" class="gutter-row" nz-col nzFlex="7"></div>
<!--      END OF LEADERBOARD-->

<!--      GAME SELECTION-->
      <div id="game_selection" class="gutter-row" nz-col nzFlex="10">
        <div nz-col>
          <div nz-row nzJustify="center">
            <p id="game_headline">Mensch Ärgere Dich Nicht</p>
          </div>
          <div nz-row nzJustify="center">
            <button id="create_game" class="game_buttons" (click)="sayHello()">
              <div class="text">
                <p>C</p><p>R</p><p>E</p><p>A</p><p>T</p><p>E</p>
                <pre> </pre><p></p>
                <p>G</p><p>A</p><p>M</p><p>E</p>
              </div>
            </button>
          </div>
          <div nz-row nzJustify="center">
            <button id="join_game" class="game_buttons" (click)="sayHello()">
              <div class="text">
                <p>J</p><p>O</p><p>I</p><p>N</p>
                <pre> </pre><p></p>
                <p>G</p><p>A</p><p>M</p><p>E</p>
              </div>
            </button>
          </div>
          <div nz-row nzJustify="center">
            <button id="join_game_id" class="game_buttons" (click)="sayHello()">
              <div class="text">
                <p>J</p><p>O</p><p>I</p><p>N</p>
                <pre> </pre><p></p>
                <p>P</p><p>E</p><p>R</p>
                <pre> </pre><p></p>
                <p>I</p><p>D</p>
              </div>
            </button>
          </div>
        </div>
      </div>
<!--      END OF GAME SELECTION-->

<!--      STATISTICS-->
      <div id="statistics" class="gutter-row" nz-col nzFlex="7"></div>
<!--      END OF STATISTICS-->
    </div>
  `,
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  sayHello(): void {
    console.log("Hello");
  }
}
