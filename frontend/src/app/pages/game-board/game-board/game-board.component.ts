import {Component, ElementRef, Inject, OnInit, Renderer2} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { DOCUMENT} from "@angular/common";
import { Router } from '@angular/router';

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.css']
})
export class GameBoardComponent implements OnInit {
  constructor(
    private http: HttpClient,
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private router: Router,
    @Inject(DOCUMENT) private document: Document,
  ) { }

  activeToken: string;
  apiToken: string;
  gameID: number;
  userID: number;
  userInGame: string; //player1 - player 4
  whosTurn: string; //player1 - player4
  highlightetFields: any;


  //TODO: Display what to do now (wait, throw dice, pick field)

  async ngOnInit(): Promise<void> {
    try{
      this.userID = JSON.parse(localStorage.getItem('currentUser')).userid;
      this.gameID = JSON.parse(localStorage.getItem('currentGame')).gameID;
      this.apiToken = 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token;
    }
    catch (e) {
      //todo: error handling, real login check
      this.router.navigate(['/login']);
    }


    this.highlightetFields = [];
    let testParent = this;
    if (!!window.EventSource) {
      var source = new EventSource('https://spielehub.server-welt.com/startStream/'+this.userID.toString());
      source.addEventListener('message', function(e) {
        console.log('sse tut');
        if(e.data != []){
          testParent.updateGameBoard(JSON.parse(e.data));
        }
        else{
          console.log('received empty data');
        }
        //console.log(e.data)
      }, false)

      this.http.post<any>('https://spielehub.server-welt.com/joinGame',{
          "gameID":this.gameID,
          "cliendID":this.userID
        },
        {
          observe: "response",
          headers: {
            "authorization": this.apiToken,
          },
        },
      )
    }

    this.fillGridWithField();

    await this.getPlayerPositions();
    //console.log(JSON.parse('{"positions":[["AR_1","AS_1","AS_2","AS_3"],["BR_7","BS_1","BS_2","BS_3"],["CS_0","CS_1","CS_2","CS_3"],["DR_4","DS_1","DS_2","DS_3"]],"isFinished":false,"nextPlayer":"Player3"}'));
  }

  updateGameBoard(response: any){
    this.setPlayerPosition(response);
    this.whosTurn = response.nextPlayer;
    this.updateGameInfo();
    this.unhiglightMoves();
    this.highlightWhosTurn();
  }

  async getPlayerPositions(){
    this.http.get<any>('https://spielehub.server-welt.com/api/getMainGame/' + this.gameID.toString(), {
        observe: "response",
        headers: {
          "authorization": this.apiToken,
        },
      }
    ).subscribe(response => {
        console.log(response);


        if (response.body.Player1 == this.userID) {
          this.userInGame = 'Player1';
        } else if (response.body.Player2 == this.userID) {
          this.userInGame = 'Player2';
        } else if (response.body.Player3 == this.userID) {
          this.userInGame = 'Player3';
        } else if (response.body.Player4 == this.userID) {
          this.userInGame = 'Player4';
        } else {
          this.userInGame = 'Player4';
          console.log('set hard to 4');
        }

        this.updateGameBoard(response.body);
        if (response.body.nextPlayer == this.userInGame){
          this.highlightMoves(response.body.allowedMoves);
        }
        this.setGameBoardForPlayer();
      },
      response => {
        console.log('an error occured in getPlayerPositions() -> getMainGame')
        console.log(response);
      }
    )
  }

  setGameBoardForPlayer(){
    //not working: the rotation
    switch (this.userInGame) {
      case "Player4":
        //document.getElementById('gameboard').style.transform = 'rotate(270deg)';
        document.getElementById('whoAmI').innerHTML += 'Schwarz';
        break;
      case "Player3":
        //document.getElementById('gameboard').style.transform = 'rotate(0deg)';
        document.getElementById('whoAmI').innerHTML += 'Rot';
        break;
      case "Player2":
        //document.getElementById('gameboard').style.transform = 'rotate(90deg)';
        document.getElementById('whoAmI').innerHTML += 'Grün';
        break;
      case "Player1":
        //document.getElementById('gameboard').style.transform = 'rotate(180deg)';
        document.getElementById('whoAmI').innerHTML += 'Gelb';
        break;
      default:
        document.getElementById('whoAmI').innerHTML += 'something gone wrong';
        console.log(this.userInGame + ' this.useringame gone wrong !!!');
    }
  }

  highlightWhosTurn(){
    let toLoop;
    switch(this.whosTurn){
      case "Player1":
        toLoop = ['AS_0','AS_1','AS_2','AS_3'];
        break;
      case "Player2":
        toLoop = ['BS_0','BS_1','BS_2','BS_3'];
        break;
      case "Player3":
        toLoop = ['CS_0','CS_1','CS_2','CS_3'];
        break;
      case "Player4":
        toLoop = ['DS_0','DS_1','DS_2','DS_3'];
        break;
    }
    for (let i = 0; i < toLoop.length; i++) {
      let id = 'field_' + toLoop[i].toString();
      if(!(document.getElementById(id).classList.contains('highlightField'))){
        document.getElementById(id).classList.add('highlightField');
      }
    }
  }

  updateGameInfo(){
    //this.whosTurn = response.body.turn;
    switch (this.whosTurn) {
      case "Player1":
        document.getElementById('whosTurnIsIt').innerHTML = 'Gelb';
        break;
      case "Player2":
        document.getElementById('whosTurnIsIt').innerHTML = 'Grün';
        break;
      case "Player3":
        document.getElementById('whosTurnIsIt').innerHTML = 'Rot';
        break;
      case "Player4":
        document.getElementById('whosTurnIsIt').innerHTML = 'Schwarz';
        break;
      default:
        document.getElementById('whosTurnIsIt').innerHTML = 'something wrong';
    }
    document.getElementById('whatsMyGameID').innerHTML = this.gameID.toString();
  }

  getGameData(){
    this.http.get<any>('https://spielehub.server-welt.com/api/getMoves/'+this.gameID.toString(),{
        observe: "response",
        headers: {
          "authorization": this.apiToken,
        },
      },
    ).subscribe(response => {
      if (response.status == 200) {
        console.log(response['body']);
        this.tossDice(response['body']['move']['dice'], response.body);
      }
    },
    response => {
      if(response.status == 403){
        if(response['error']['msg'] == 'make Move first'){
          console.log(response);
          this.highlightMoves(response['error']['moves']);
        }
      }
    }
    );
  }

  sendGameData(fieldID: string, json: any){
    //console.log(json[0]);
    //console.log(fieldID);
    if(json[0] == fieldID || json[1] == fieldID ||
      json[2] == fieldID || json[3] == fieldID){
      this.http.put<any>('https://spielehub.server-welt.com/api/makeMove',
        {
          "move":fieldID,
          "id":this.gameID
        },
        {
          observe: "response",
          headers: {
            "authorization": this.apiToken,
          },
        }
      ).subscribe(response => {
        if (response.status == 200) {
          //console.log('game data successfully send!');
          console.log(response);
          this.unhiglightMoves();
          this.setPlayerPosition(response['body']);
          this.updateGameInfo();
        }
      });
    }
    else{
      console.log('incorrect field, choose another');
    }
  }

  setPlayerPosition(gameBoard: any){
    if(gameBoard['positions'][0] != null && gameBoard['positions'][0] != 'null'
    && gameBoard['positions'][1] != null && gameBoard['positions'][1] != 'null'
    && gameBoard['positions'][2] != null && gameBoard['positions'][2] != 'null'
    && gameBoard['positions'][3] != null && gameBoard['positions'][3] != 'null'){
      let colors = ['Yellow', 'Green', 'Red', 'Black'];
      colors.forEach((currentValue, index, array) => {
        for (let i = 1; i < 5; i++) {
          let tokenID = 'token' +i.toString() + '_' + currentValue;
          let fieldID = 'field_'+gameBoard['positions'][index][i-1];
          //console.log('moving ' + tokenID + ' to field ' + fieldID);
          this.moveTokenToField(tokenID, fieldID);
        }
      });
    }
  }

  tossDice(randNum: number, jsonReturned: any) {
    const cube = document.getElementById('cube');
    cube.className = "";

    cube.classList.add('is-spinning-' + randNum);
    cube.addEventListener("animationend", () => {
      cube.classList.remove("is-spinning-" + randNum);
      const showClass = 'show-' + randNum;
      cube.classList.add(showClass);
      this.highlightMoves(jsonReturned.move.fields);

    }, {once: true});
  }

  highlightMoves(json: any){
    if (json[0] == null && json[1] == null &&
      json[2] == null && json[3] == null) {
        console.log('no moves available');
      }
    else {
      let fieldToHighlight;
      if (json[0] != 'null' && json[0] != '' && json[0] != null) {
        let id = 'field_' + json[0];
        fieldToHighlight = document.getElementById(id);
        fieldToHighlight.classList.add('highlightField');
        fieldToHighlight.addEventListener('click', () => this.sendGameData(json[0], json));
      }
      if (json[1] != 'null' && json[1] != '' && json[1] != null && json[1] != json[0]) {
        let id = 'field_' + json[1];
        fieldToHighlight = document.getElementById(id);
        fieldToHighlight.classList.add('highlightField');
        fieldToHighlight.addEventListener('click', () => this.sendGameData(json[1], json));
      }
      if (json[2] != 'null' && json[2] != '' && json[2] != null && json[2] != json[0] && json[2] != json[1]) {
        let id = 'field_' + json[2];
        fieldToHighlight = document.getElementById(id);
        fieldToHighlight.classList.add('highlightField');
        fieldToHighlight.addEventListener('click', () => this.sendGameData(json[2], json));
      }
      if (json[3] != 'null' && json[3] != '' && json[3] != null && json[3] != json[0] && json[3] != json[1] && json[3] != json[2]) {
        let id = 'field_' + json[3];
        fieldToHighlight = document.getElementById(id);
        fieldToHighlight.classList.add('highlightField');
        fieldToHighlight.addEventListener('click', () => this.sendGameData(json[3], json));
      }
    }
  }

  unhiglightMoves(){
    let allHighlightedFields = document.getElementsByClassName('highlightField');
    console.log(allHighlightedFields);
    for (let i = 0; i < allHighlightedFields.length; i++) {
      console.log('trying to remove class from ' + allHighlightedFields[i].id);
      allHighlightedFields[i].classList.remove('highlightField');
      console.log('removed, checking ' + allHighlightedFields[i].id);
      if(allHighlightedFields[i].classList.contains('highlightField')){
        console.log(allHighlightedFields[i].id + ' still has class HighlightedFields');
      }
    }
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

    return element;
  }

  generateSingleToken(id: string, color: string): any{
    let token = this.renderer.createElement("div");
    token.setAttribute("id", id);
    token.style.backgroundColor = color;
    token.classList.add("gameBoardToken");
    return token;
  }

  moveTokenToField(token: string, field: string): void{
    let tokenElement = document.getElementById(token);
    let fieldElement = document.getElementById(field);
    //console.log('moving token ' + token + ' to field ' + field);
    fieldElement.appendChild(tokenElement);
  }

  //following are only methods for creating game board,

  createInitialTokens(){
    let tokenGreen = ['field_BS_0', 'field_BS_1', 'field_BS_2', 'field_BS_3'];
    let tokenRed = ['field_CS_0','field_CS_1','field_CS_2','field_CS_3'];
    let tokenBlack = ['field_DS_0','field_DS_1','field_DS_2','field_DS_3'];
    let tokenYellow = ['field_AS_0','field_AS_1','field_AS_2','field_AS_3'];
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
    let walkingFields = ['BR_1','BR_2','BR_3','BR_4','BR_5','BR_6','BR_7','BR_8','BR_9'];
    walkingFields.push('CR_1','CR_2','CR_3','CR_4','CR_5','CR_6','CR_7','CR_8','CR_9');
    walkingFields.push('DR_1','DR_2','DR_3','DR_4','DR_5','DR_6','DR_7','DR_8','DR_9');
    walkingFields.push('AR_1','AR_2','AR_3','AR_4','AR_5','AR_6','AR_7','AR_8','AR_9');
    walkingFields.forEach((currentValue, index, array) => {
      let coordinatesForField = 'field_' + currentValue;
      let element = this.generateSingleField(coordinatesForField, 'white', '', true);
      this.renderer.appendChild(document.getElementById(currentValue), element);
    });

    //creating the start fields
    let startFields = ['BR_0','CR_0','DR_0','AR_0'];
    playerColors.forEach((currentValue, index, array) => {
      let coordinatesForField = 'field_' + startFields[index];
      let element = this.generateSingleField(coordinatesForField, currentValue, '', true);
      this.renderer.appendChild(document.getElementById(startFields[index]), element);
    });
  }

  generateHomeFields(playerColors: string[]){
    let homeFields = ['BS_0','BS_1','BS_2','BS_3']; //green top right
    homeFields.push('CS_0','CS_1','CS_2','CS_3'); //red bottom right
    homeFields.push('DS_0','DS_1','DS_2','DS_3'); //black bottom left
    homeFields.push('AS_0','AS_1','AS_2','AS_3'); //yellow top left

    homeFields.forEach((currentValue, index, array) => {
      let coordinatesForField = 'field_' + currentValue;
      let element = this.generateSingleField(coordinatesForField, playerColors[Math.trunc(index/4)], '', false);
      this.renderer.appendChild(document.getElementById(currentValue), element);
    });
  }

  generateFinishFields(playerColors: string[]){
    let finishFields = ['BF_0','BF_1','BF_2','BF_3'];
    finishFields.push('CF_0','CF_1','CF_2','CF_3');
    finishFields.push('DF_0','DF_1','DF_2','DF_3');
    finishFields.push('AF_0','AF_1','AF_2','AF_3');

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

  toggleRules(): void {
    let accordion = document.getElementById('accordion');
    let regeln = document.getElementById('regeln');
    accordion.classList.toggle("active");

    if (regeln.style.display === "block") {
      regeln.style.display = "none";
    } else {
      regeln.style.display = "block";
    }
  }
}
