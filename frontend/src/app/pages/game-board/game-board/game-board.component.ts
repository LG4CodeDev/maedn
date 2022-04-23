import { Component, OnInit } from '@angular/core';
import {delay} from "rxjs/operators";

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
        <div nz-row id="regeln">Spielregeln</div>
        <div nz-row id="dice" nzJustify="center">
              <div class = "scene">
                <div id="cube">
                  <img src="assets/dice/dice-1.png" class="cube__face cube__face--1">
                  <img src="assets/dice/dice-2.png" class="cube__face cube__face--2">
                  <img src="assets/dice/dice-3.png" class="cube__face cube__face--3">
                  <img src="assets/dice/dice-4.png" class="cube__face cube__face--4">
                  <img src="assets/dice/dice-5.png" class="cube__face cube__face--5">
                  <img src="assets/dice/dice-6.png" class="cube__face cube__face--6">
                </div>
              </div>
              <button class ="rollBtn" (click)="tossDice()">Roll the Dice</button>
            </div>
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
    const cube = document.getElementById('cube');
    cube.classList.add('cubeRotate')
    function randInt() {
      return Math.floor(Math.random() * 6) +1;
    }

    function rollDice() {
      const randNum = randInt();
      if(cube.className === "show-" + randNum){

      }
      const showClass = 'show-' + randNum;
      cube.className = "";
      console.log(randNum)
      cube.classList.add( showClass );
    }

    rollDice();
  }
}
