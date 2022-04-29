import {Component, ElementRef, Inject, OnInit, Renderer2} from '@angular/core';
import { DOCUMENT} from "@angular/common";

@Component({
  selector: 'app-game-board',
  //templateUrl: './game-board.component.html',
  template: `
    <div nz-row>
      <div nz-col class="side-left" nzFlex="auto">

      </div>
      <div nz-col class="game" nzXs="12" nzSm="12" nzMd="12" nzLg="12" nzXl="12">
          <div nz-row class="row">
            <div nz-col class="board" id="ul">
              <div nz-row class="row_4_4" id="ul_r_1">
                <div nz-col class="col_4_4" id="ul_r_1_c_1"></div>
                <div nz-col class="col_4_4" id="ul_r_1_c_2"></div>
                <div nz-col class="col_4_4" id="ul_r_1_c_3"></div>
                <div nz-col class="col_4_4" id="ul_r_1_c_4"></div>
              </div>
              <div nz-row class="row_4_4" id="ul_r_2">
                <div nz-col class="col_4_4" id="ul_r_2_c_1"></div>
                <div nz-col class="col_4_4" id="ul_r_2_c_2"></div>
                <div nz-col class="col_4_4" id="ul_r_2_c_3"></div>
                <div nz-col class="col_4_4" id="ul_r_2_c_4"></div>
              </div>
              <div nz-row class="row_4_4" id="ul_r_3">
                <div nz-col class="col_4_4" id="ul_r_3_c_1"></div>
                <div nz-col class="col_4_4" id="ul_r_3_c_2"></div>
                <div nz-col class="col_4_4" id="ul_r_3_c_3"></div>
                <div nz-col class="col_4_4" id="ul_r_3_c_4"></div>
              </div>
              <div nz-row class="row_4_4" id="ul_r_4">
                <div nz-col class="col_4_4" id="ul_r_4_c_1"></div>
                <div nz-col class="col_4_4" id="ul_r_4_c_2"></div>
                <div nz-col class="col_4_4" id="ul_r_4_c_3"></div>
                <div nz-col class="col_4_4" id="ul_r_4_c_4"></div>
              </div>
            </div>
            <div nz-col class="board" id="um">
              <div nz-row class="row_4_3" id="um_r_1">
                <div nz-col class="col_4_3" id="um_r_1_c_1"></div>
                <div nz-col class="col_4_3" id="um_r_1_c_2"></div>
                <div nz-col class="col_4_3" id="um_r_1_c_3"></div>
              </div>
              <div nz-row class="row_4_3" id="um_r_2">
                <div nz-col class="col_4_3" id="um_r_2_c_1"></div>
                <div nz-col class="col_4_3" id="um_r_2_c_2"></div>
                <div nz-col class="col_4_3" id="um_r_2_c_3"></div>
              </div>
              <div nz-row class="row_4_3" id="um_r_3">
                <div nz-col class="col_4_3" id="um_r_3_c_1"></div>
                <div nz-col class="col_4_3" id="um_r_3_c_2"></div>
                <div nz-col class="col_4_3" id="um_r_3_c_3"></div>
              </div>
              <div nz-row class="row_4_3" id="um_r_4">
                <div nz-col class="col_4_3" id="um_r_4_c_1"></div>
                <div nz-col class="col_4_3" id="um_r_4_c_2"></div>
                <div nz-col class="col_4_3" id="um_r_4_c_3"></div>
              </div>
            </div>
            <div nz-col class="board" id="ur">
              <div nz-row class="row_4_4" id="ur_r_1">
                <div nz-col class="col_4_4" id="ur_r_1_c_1"></div>
                <div nz-col class="col_4_4" id="ur_r_1_c_2"></div>
                <div nz-col class="col_4_4" id="ur_r_1_c_3"></div>
                <div nz-col class="col_4_4" id="ur_r_1_c_4"></div>
              </div>
              <div nz-row class="row_4_4" id="ur_r_2">
                <div nz-col class="col_4_4" id="ur_r_2_c_1"></div>
                <div nz-col class="col_4_4" id="ur_r_2_c_2"></div>
                <div nz-col class="col_4_4" id="ur_r_2_c_3"></div>
                <div nz-col class="col_4_4" id="ur_r_2_c_4"></div>
              </div>
              <div nz-row class="row_4_4" id="ur_r_3">
                <div nz-col class="col_4_4" id="ur_r_3_c_1"></div>
                <div nz-col class="col_4_4" id="ur_r_3_c_2"></div>
                <div nz-col class="col_4_4" id="ur_r_3_c_3"></div>
                <div nz-col class="col_4_4" id="ur_r_3_c_4"></div>
              </div>
              <div nz-row class="row_4_4" id="ur_r_4">
                <div nz-col class="col_4_4" id="ur_r_4_c_1"></div>
                <div nz-col class="col_4_4" id="ur_r_4_c_2"></div>
                <div nz-col class="col_4_4" id="ur_r_4_c_3"></div>
                <div nz-col class="col_4_4" id="ur_r_4_c_4"></div>
              </div>
            </div>
          </div>
          <div nz-row class="row">
            <div nz-col class="board" id="ml">
              <div nz-row class="row_3_4" id="ml_r_1">
                <div nz-col class="col_3_4" id="ml_r_1_c_1"></div>
                <div nz-col class="col_3_4" id="ml_r_1_c_2"></div>
                <div nz-col class="col_3_4" id="ml_r_1_c_3"></div>
                <div nz-col class="col_3_4" id="ml_r_1_c_4"></div>
              </div>
              <div nz-row class="row_3_4" id="ml_r_2">
                <div nz-col class="col_3_4" id="ml_r_2_c_1"></div>
                <div nz-col class="col_3_4" id="ml_r_2_c_2"></div>
                <div nz-col class="col_3_4" id="ml_r_2_c_3"></div>
                <div nz-col class="col_3_4" id="ml_r_2_c_4"></div>
              </div>
              <div nz-row class="row_3_4" id="ml_r_3">
                <div nz-col class="col_3_4" id="ml_r_3_c_1"></div>
                <div nz-col class="col_3_4" id="ml_r_3_c_2"></div>
                <div nz-col class="col_3_4" id="ml_r_3_c_3"></div>
                <div nz-col class="col_3_4" id="ml_r_3_c_4"></div>
              </div>
            </div>
            <div nz-col class="board" id="mm">
              <div nz-row class="row_3_3" id="mm_r_1">
                <div nz-col class="col_3_3" id="mm_r_1_c_1"></div>
                <div nz-col class="col_3_3" id="mm_r_1_c_2"></div>
                <div nz-col class="col_3_3" id="mm_r_1_c_3"></div>
              </div>
              <div nz-row class="row_3_3" id="mm_r_2">
                <div nz-col class="col_3_3" id="mm_r_2_c_1"></div>
                <div nz-col class="col_3_3" id="mm_r_2_c_2"></div>
                <div nz-col class="col_3_3" id="mm_r_2_c_3"></div>
              </div>
              <div nz-row class="row_3_3" id="mm_r_3">
                <div nz-col class="col_3_3" id="mm_r_3_c_1"></div>
                <div nz-col class="col_3_3" id="mm_r_3_c_2"></div>
                <div nz-col class="col_3_3" id="mm_r_3_c_3"></div>
              </div>
            </div>
            <div nz-col class="board" id="mr">
              <div nz-row class="row_3_4" id="mr_r_1">
                <div nz-col class="col_3_4" id="mr_r_1_c_1"></div>
                <div nz-col class="col_3_4" id="mr_r_1_c_2"></div>
                <div nz-col class="col_3_4" id="mr_r_1_c_3"></div>
                <div nz-col class="col_3_4" id="mr_r_1_c_4"></div>
              </div>
              <div nz-row class="row_3_4" id="mr_r_2">
                <div nz-col class="col_3_4" id="mr_r_2_c_1"></div>
                <div nz-col class="col_3_4" id="mr_r_2_c_2"></div>
                <div nz-col class="col_3_4" id="mr_r_2_c_3"></div>
                <div nz-col class="col_3_4" id="mr_r_2_c_4"></div>
              </div>
              <div nz-row class="row_3_4" id="mr_r_3">
                <div nz-col class="col_3_4" id="mr_r_3_c_1"></div>
                <div nz-col class="col_3_4" id="mr_r_3_c_2"></div>
                <div nz-col class="col_3_4" id="mr_r_3_c_3"></div>
                <div nz-col class="col_3_4" id="mr_r_3_c_4"></div>
              </div>
            </div>
          </div>
          <div nz-row class="row">
            <div nz-col class="board" id="bl">
              <div nz-row class="row_4_4" id="bl_r_1">
                <div nz-col class="col_4_4" id="bl_r_1_c_1"></div>
                <div nz-col class="col_4_4" id="bl_r_1_c_2"></div>
                <div nz-col class="col_4_4" id="bl_r_1_c_3"></div>
                <div nz-col class="col_4_4" id="bl_r_1_c_4"></div>
              </div>
              <div nz-row class="row_4_4" id="bl_r_2">
                <div nz-col class="col_4_4" id="bl_r_2_c_1"></div>
                <div nz-col class="col_4_4" id="bl_r_2_c_2"></div>
                <div nz-col class="col_4_4" id="bl_r_2_c_3"></div>
                <div nz-col class="col_4_4" id="bl_r_2_c_4"></div>
              </div>
              <div nz-row class="row_4_4" id="bl_r_3">
                <div nz-col class="col_4_4" id="bl_r_3_c_1"></div>
                <div nz-col class="col_4_4" id="bl_r_3_c_2"></div>
                <div nz-col class="col_4_4" id="bl_r_3_c_3"></div>
                <div nz-col class="col_4_4" id="bl_r_3_c_4"></div>
              </div>
              <div nz-row class="row_4_4" id="bl_r_4">
                <div nz-col class="col_4_4" id="bl_r_4_c_1"></div>
                <div nz-col class="col_4_4" id="bl_r_4_c_2"></div>
                <div nz-col class="col_4_4" id="bl_r_4_c_3"></div>
                <div nz-col class="col_4_4" id="bl_r_4_c_4"></div>
              </div>
            </div>
            <div nz-col class="board" id="bm">
              <div nz-row class="row_4_3" id="bm_r_1">
                <div nz-col class="col_4_3" id="bm_r_1_c_1"></div>
                <div nz-col class="col_4_3" id="bm_r_1_c_2"></div>
                <div nz-col class="col_4_3" id="bm_r_1_c_3"></div>
              </div>
              <div nz-row class="row_4_3" id="bm_r_2">
                <div nz-col class="col_4_3" id="bm_r_2_c_1"></div>
                <div nz-col class="col_4_3" id="bm_r_2_c_2"></div>
                <div nz-col class="col_4_3" id="bm_r_2_c_3"></div>
              </div>
              <div nz-row class="row_4_3" id="bm_r_3">
                <div nz-col class="col_4_3" id="bm_r_3_c_1"></div>
                <div nz-col class="col_4_3" id="bm_r_3_c_2"></div>
                <div nz-col class="col_4_3" id="bm_r_3_c_3"></div>
              </div>
              <div nz-row class="row_4_3" id="bm_r_4">
                <div nz-col class="col_4_3" id="bm_r_4_c_1"></div>
                <div nz-col class="col_4_3" id="bm_r_4_c_2"></div>
                <div nz-col class="col_4_3" id="bm_r_4_c_3"></div>
              </div>
            </div>
            <div nz-col class="board" id="br">
              <div nz-row class="row_4_4" id="br_r_1">
                <div nz-col class="col_4_4" id="br_r_1_c_1"></div>
                <div nz-col class="col_4_4" id="br_r_1_c_2"></div>
                <div nz-col class="col_4_4" id="br_r_1_c_3"></div>
                <div nz-col class="col_4_4" id="br_r_1_c_4"></div>
              </div>
              <div nz-row class="row_4_4" id="br_r_2">
                <div nz-col class="col_4_4" id="br_r_2_c_1"></div>
                <div nz-col class="col_4_4" id="br_r_2_c_2"></div>
                <div nz-col class="col_4_4" id="br_r_2_c_3"></div>
                <div nz-col class="col_4_4" id="br_r_2_c_4"></div>
              </div>
              <div nz-row class="row_4_4" id="br_r_3">
                <div nz-col class="col_4_4" id="br_r_3_c_1"></div>
                <div nz-col class="col_4_4" id="br_r_3_c_2"></div>
                <div nz-col class="col_4_4" id="br_r_3_c_3"></div>
                <div nz-col class="col_4_4" id="br_r_3_c_4"></div>
              </div>
              <div nz-row class="row_4_4" id="br_r_4">
                <div nz-col class="col_4_4" id="br_r_4_c_1"></div>
                <div nz-col class="col_4_4" id="br_r_4_c_2"></div>
                <div nz-col class="col_4_4" id="br_r_4_c_3"></div>
                <div nz-col class="col_4_4" id="br_r_4_c_4"></div>
              </div>
            </div>
          </div>
      </div>
      <div nz-col class="side-right" nzXs="4" nzSm="4" nzMd="4" nzLg="4" nzXl="4">
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
        </div>
        <div nz-row id="dice-btn" nzJustify="center">
          <button class ="rollBtn" (click)="tossDice()">Roll the Dice</button>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./game-board.component.css']
})
export class GameBoardComponent implements OnInit {
  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document) { }

  activeToken: string;

  ngOnInit(): void {
    this.fillGridWithField();
    this.mainGame();
  }

  tossDice() {
    const cube = document.getElementById('cube');
    cube.className = "";

    function randInt() {
      return Math.floor(Math.random() * 6) + 1;
    }

    const randNum = randInt();
    cube.classList.add('is-spinning-' + randNum);
    cube.addEventListener("animationend", () => {
      cube.classList.remove("is-spinning-" + randNum);


      function rollDice() {
        const showClass = 'show-' + randNum;
        cube.classList.add(showClass);
        console.log(randNum)
      }

      rollDice();
    }, {once: true});
  }

  mainGame(): void{

  }

  fillGridWithField(): void {
    //general order for players: top right begin, clockwise through the board (bott right, bott left, top left)
    let playerColors = ['green','red','black','gold'];


    this.genertateWalkingFields(playerColors);

    this.generateHomeFields(playerColors);

    this.generateFinishFields(playerColors);

    this.createBoardWritting();

    this.createInitialTokens();
  }

  generateSingleField(coordinates: string, color: string, content: string, isBig: Boolean): any{
    let element = this.renderer.createElement("div");
    element.setAttribute("id", coordinates);
    if (isBig){
      element.classList.add("field-gameboard");
    }
    else{
      element.classList.add('field-startFinish');
    }
    element.style.backgroundColor = color;
    element.innerHTML = content;
    element.addEventListener('click', () => {
      if(element.childElementCount == 0){
        console.log(coordinates);
        if(this.activeToken != null){
          this.moveTokenToField(this.activeToken, coordinates);
          this.activeToken = null;
        }
      }
    }); //TODO onclick implement
    return element;
  }

  generateSingleToken(id: string, color: string): any{
    let token = this.renderer.createElement("div");
    token.setAttribute("id", id);
    token.style.backgroundColor = color;
    token.addEventListener('click', () => {
      console.log(id);
      this.activeToken = id;
    }); //TODO onclick implement
    token.classList.add("gameBoardToken");
    return token;
  }

  moveTokenToField(token: string, field: string): void{
    let tokenElement = document.getElementById(token);
    let fieldElement = document.getElementById(field);
    fieldElement.appendChild(tokenElement);
    //tokenElement.parentNode.removeChild(tokenElement);
  }

  //following are only methods for creating game board,
  //TODO: auslagern

  createInitialTokens(){
    let tokenGreen = ['field_ur_r_1_c_3', 'field_ur_r_1_c_4', 'field_ur_r_2_c_3', 'field_ur_r_2_c_4'];
    let tokenRed = ['field_br_r_3_c_3','field_br_r_3_c_4','field_br_r_4_c_3','field_br_r_4_c_4'];
    let tokenBlack = ['field_bl_r_3_c_1','field_bl_r_3_c_2','field_bl_r_4_c_1','field_bl_r_4_c_2'];
    let tokenYellow = ['field_ul_r_1_c_1','field_ul_r_1_c_2','field_ul_r_2_c_1','field_ul_r_2_c_2'];
    tokenGreen.forEach((currentValue, index, array) => {
      let idOfToken = 'token'+(index+1)+'_'+'Green';
      let tokenToAdd = this.generateSingleToken(idOfToken, 'lightgreen');
      this.renderer.appendChild(document.getElementById(currentValue), tokenToAdd);
    });
    tokenRed.forEach((currentValue, index, array) => {
      let idOfToken = 'token'+(index+1)+'_'+'Red';
      let tokenToAdd = this.generateSingleToken(idOfToken, 'lightcoral');
      this.renderer.appendChild(document.getElementById(currentValue), tokenToAdd);
    });
    tokenBlack.forEach((currentValue, index, array) => {
      let idOfToken = 'token'+(index+1)+'_'+'Black';
      let tokenToAdd = this.generateSingleToken(idOfToken, 'darkgrey');
      this.renderer.appendChild(document.getElementById(currentValue), tokenToAdd);
    });
    tokenYellow.forEach((currentValue, index, array) => {
      let idOfToken = 'token'+(index+1)+'_'+'Yellow';
      let tokenToAdd = this.generateSingleToken(idOfToken, 'yellow');
      this.renderer.appendChild(document.getElementById(currentValue), tokenToAdd);
    });
  }

  genertateWalkingFields(playerColors: string[]){
    //create all normal walking fields
    let walkingFields = ['um_r_2_c_3','um_r_3_c_3','um_r_4_c_3','mm_r_1_c_3','mr_r_1_c_1','mr_r_1_c_2','mr_r_1_c_3','mr_r_1_c_4','mr_r_2_c_4'];
    walkingFields.push('mr_r_3_c_3','mr_r_3_c_2','mr_r_3_c_1','mm_r_3_c_3','bm_r_1_c_3','bm_r_2_c_3','bm_r_3_c_3','bm_r_4_c_3','bm_r_4_c_2');
    walkingFields.push('bm_r_3_c_1','bm_r_2_c_1','bm_r_1_c_1','mm_r_3_c_1','ml_r_3_c_4','ml_r_3_c_3','ml_r_3_c_2','ml_r_3_c_1','ml_r_2_c_1');
    walkingFields.push('ml_r_1_c_2','ml_r_1_c_3','ml_r_1_c_4','mm_r_1_c_1','um_r_4_c_1','um_r_3_c_1','um_r_2_c_1','um_r_1_c_1','um_r_1_c_2');
    walkingFields.forEach((currentValue, index, array) => {
      let coordinatesForField = 'field_' + currentValue;
      let element = this.generateSingleField(coordinatesForField, 'white', '', true);
      this.renderer.appendChild(document.getElementById(currentValue), element);
    });

    //creating the start fields
    let startFields = ['um_r_1_c_3','mr_r_3_c_4','bm_r_4_c_1','ml_r_1_c_1'];
    playerColors.forEach((currentValue, index, array) => {
      let coordinatesForField = 'field_' + startFields[index];
      let element = this.generateSingleField(coordinatesForField, currentValue, 'A', true);
      this.renderer.appendChild(document.getElementById(startFields[index]), element);
    });
  }

  generateHomeFields(playerColors: string[]){
    let homeFields = ['ur_r_1_c_3','ur_r_1_c_4','ur_r_2_c_3','ur_r_2_c_4']; //green top right
    homeFields.push('br_r_3_c_3','br_r_3_c_4','br_r_4_c_3','br_r_4_c_4'); //red bottom right
    homeFields.push('bl_r_3_c_1','bl_r_3_c_2','bl_r_4_c_1','bl_r_4_c_2'); //black bottom left
    homeFields.push('ul_r_1_c_1','ul_r_1_c_2','ul_r_2_c_1','ul_r_2_c_2'); //yellow top left

    homeFields.forEach((currentValue, index, array) => {
      let coordinatesForField = 'field_' + currentValue;
      let element = this.generateSingleField(coordinatesForField, playerColors[Math.trunc(index/4)], '', false);
      this.renderer.appendChild(document.getElementById(currentValue), element);
    });
  }

  generateFinishFields(playerColors: string[]){
    let finishFields = ['um_r_2_c_2','um_r_3_c_2','um_r_4_c_2','mm_r_1_c_2'];
    finishFields.push('mr_r_2_c_3','mr_r_2_c_2','mr_r_2_c_1','mm_r_2_c_3');
    finishFields.push('bm_r_3_c_2','bm_r_2_c_2','bm_r_1_c_2','mm_r_3_c_2');
    finishFields.push('ml_r_2_c_2','ml_r_2_c_3','ml_r_2_c_4','mm_r_2_c_1');

    finishFields.forEach((currentValue, index, array) => {
      let coordinatesForField = 'field_' + currentValue;
      let element = this.generateSingleField(coordinatesForField, playerColors[Math.trunc(index/4)], '', false);
      this.renderer.appendChild(document.getElementById(currentValue), element);
    });
  }

  createBoardWritting(){
    let boardWritting = this.renderer.createElement("div");
    boardWritting.setAttribute("id", 'boardWritting_top_left');
    boardWritting.innerText = 'Mensch';
    boardWritting.classList.add('boardWrittingTop');
    this.renderer.appendChild(document.getElementById('ul_r_3_c_3'), boardWritting);

    boardWritting =  this.renderer.createElement("div");
    boardWritting.setAttribute("id", 'boardWritting_top_right');
    boardWritting.innerText = 'ärgere';
    boardWritting.classList.add('boardWrittingTop');
    this.renderer.appendChild(document.getElementById('ur_r_3_c_2'), boardWritting);

    boardWritting =  this.renderer.createElement("div");
    boardWritting.setAttribute("id", 'boardWritting_bottom_left');
    boardWritting.innerText = 'dich';
    boardWritting.classList.add('boardWrittingBottom');
    this.renderer.appendChild(document.getElementById('bl_r_1_c_3'), boardWritting);

    boardWritting =  this.renderer.createElement("div");
    boardWritting.setAttribute("id", 'boardWritting_bottom_right');
    boardWritting.innerText = 'nicht';
    boardWritting.classList.add('boardWrittingBottom');
    this.renderer.appendChild(document.getElementById('br_r_1_c_2'), boardWritting);
  }
}
