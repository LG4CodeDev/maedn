import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-game-board',
  //templateUrl: './game-board.component.html',
  template: `
    <div nz-row>
      <div nz-col class="side" nzFlex="auto">

      </div>
      <div nz-col class="game" nzFlex="15">
          <div nz-row class="row">
            <div nz-col class="board" id="ul"><h1>1.1</h1></div>
            <div nz-col class="board" id="um"><h1>1.2</h1></div>
            <div nz-col class="board" id="ur"><h1>1.3</h1></div>
          </div>
          <div nz-row class="row">
            <div nz-col class="board" id="ml"><h1>2.1</h1></div>
            <div nz-col class="board" id="mm"><h1>2.2</h1></div>
            <div nz-col class="board" id="mr"><h1>2.3</h1></div>
          </div>
          <div nz-row class="row">
            <div nz-col class="board" id="bl"><h1>3.1</h1></div>
            <div nz-col class="board" id="bm"><h1>3.2</h1></div>
            <div nz-col class="board" id="br"><h1>3.3</h1></div>
          </div>
      </div>
      <div nz-col class="side" nzFlex="auto">
        <div nz-row></div>

        <div nz-row>
          <div class = "scene">
            <div class="cube">
              <div class="cube__face cube__face--1">1</div>
              <div class="cube__face cube__face--2">2</div>
              <div class="cube__face cube__face--3">3</div>
              <div class="cube__face cube__face--4">4</div>
              <div class="cube__face cube__face--5">5</div>
              <div class="cube__face cube__face--6">6</div>
            </div>
            <button class ="rollBtn" (click)="tossDice()">Roll the Dice</button>
          </div>
        </div>

        <div nz-row></div>
      </div>
    </div>
  `,
  styleUrls: ['./game-board.component.css']
})
export class GameBoardComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  tossDice(){
    const cube = document.querySelector('.cube');
    let currentClass = '';


    function getRandomInt() {
      return Math.floor(Math.random() * 6) +1;
    }

    function rollDice() {

      const randNum = getRandomInt();
      console.log(randNum)

      const showClass = 'show-' + randNum;
      console.log(showClass)

      if ( currentClass ) {
        console.log("Removing...")
        cube.classList.remove( currentClass );
      }

      cube.classList.add( showClass );

      currentClass = showClass;
    }

    rollDice();
  }
}
