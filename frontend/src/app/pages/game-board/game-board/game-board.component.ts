import {Component, ElementRef, Inject, OnInit, Renderer2} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {DOCUMENT} from "@angular/common";
import {Router} from '@angular/router';
import {delay} from "rxjs/operators";
import {NzModalService} from "ng-zorro-antd/modal";

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
    private modal: NzModalService,
    @Inject(DOCUMENT) private document: Document,
  ) {
  }

  activeToken: string;
  apiToken: string;
  gameID: number;
  userID: number;   //number of own user
  userInGame: string; //player1 - player 4
  whosTurn: string; //player1 - player4

  //TODO: Display what to do now (wait, throw dice, pick field)
  //TODO: always spin cube if its your turn, roll just stops it :)
  //TODO: status 'anderer player dran'

  async ngOnInit(): Promise<void> {
    try {
      this.userID = JSON.parse(localStorage.getItem('currentUser')).userid;
      this.gameID = JSON.parse(localStorage.getItem('currentGame')).gameID;
      this.apiToken = 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token;
    } catch (e) {
      //todo: error handling, real login check
      await this.router.navigate(['/login']);
    }

    let parent = this;
    if (!!window.EventSource) {
      let source = new EventSource('https://spielehub.server-welt.com/startStream/' + this.userID.toString());
      source.addEventListener('message', function (e) {
        if (e.data != []) {
          parent.updateGameBoard(JSON.parse(e.data));
        } else {
          console.log('received empty data');
        }
      }, false)

      this.http.post<any>('https://spielehub.server-welt.com/joinGame', {
          "gameID": this.gameID,
          "cliendID": this.userID
        },
        {
          observe: "response",
          headers: {
            "authorization": this.apiToken,
          },
        },
      )
    }
    //create game board
    this.fillGridWithField();
    //get on refresh all game information
    await this.getMainGame();
  }


  /**
   * update complete gameboard with new information (playerpositions, whosTurn, gameInfo etc
   * checks for winn or not started
   * @param response has to be body from api call or sse
   */
  updateGameBoard(response: any) {
    this.setPlayerPosition(response);

    if (response.status == 'Finished') {
      this.onFinished(response);
    }
    else if (response.status == 'notStarted') {
      this.updateDisplayStatus('Das Spiel hat noch nicht angefangen, Warte auf Spieler');
      document.getElementById('whatsMyGameID').innerHTML = this.gameID.toString();
    }
    else {
      this.whosTurn = response.nextPlayer;
      this.updateGameInfo();
      this.unhiglightMoves();
      this.highlightWhosTurn();
    }
  }

  /**
   * display winning stuff: modal with who won, firework and info board status
   * @param response body of api return, has to contain .nextPlayer
   */
  onFinished(response: any){
    this.updateDisplayStatus('Jemand hat gewonnen, Spiel vorbei');
    let userWhoWon;
    switch (response.nextPlayer) { //in next player is player who whon game if state = 'Finished'
      case "Player1":
        userWhoWon = 'Gelb';
        break;
      case "Player2":
        userWhoWon = 'Grün';
        break;
      case "Player3":
        userWhoWon = 'Rot';
        break;
      case "Player4":
        userWhoWon = 'Schwarz';
        break;
      default:
        document.getElementById('whosTurnIsIt').innerHTML = 'something wrong';
    }
    let modal = this.modal.create({
      nzTitle: "Das Spiel wurde beendet!",
      nzContent: userWhoWon + " hat gewonnen!",
      nzClassName: "my-modal",
      nzOkText: 'Lobby',
      nzOnOk: () => {
        this.router.navigate(['/lobby']).then();
        localStorage.removeItem('currentGame');
      }
    });
    createFirework();
  }

  /**
   * set info of state on info panel on the left
   * @param message innerHTML that shall be set
   */
  updateDisplayStatus(message: string) {
    document.getElementById('whatsTheState').innerHTML = message;
  }

  /**
   * Calls API /getMainGame and refreshes game board with received info, sets:
   * this.userInGame with string 'player1 / player2 ...'
   * ownPlayerColor info on info panel
   *
   * calls updateGameBoard
   */
  async getMainGame() {
    this.http.get<any>('https://spielehub.server-welt.com/api/getMainGame/' + this.gameID.toString(), {
        observe: "response",
        headers: {
          "authorization": this.apiToken,
        },
      }
    ).subscribe(response => {
        //console.log(response);

        if (response.body.Player1 == this.userID) {
          this.userInGame = 'Player1';
        } else if (response.body.Player2 == this.userID) {
          this.userInGame = 'Player2';
        } else if (response.body.Player3 == this.userID) {
          this.userInGame = 'Player3';
        } else if (response.body.Player4 == this.userID) {
          this.userInGame = 'Player4';
        } else {
          //TODO snackbar
          this.router.navigate(['/lobby']);
          localStorage.removeItem('currentGame');
        }

        this.updateGameBoard(response.body);
        if (response.body.nextPlayer == this.userInGame) {
          this.highlightMoves(response.body.allowedMoves);
        }
        this.setOwnPlayerColorInfo();
      },
      response => {
        console.log('an error occured in getPlayerPositions() -> getMainGame:')
        console.log(response);
      }
    )
  }

  /**
   * calls this.userInGame to set 'Du bist farbe' panel on the left of gameboard
   */
  setOwnPlayerColorInfo() {
    switch (this.userInGame) {
      case "Player4":
        document.getElementById('whoAmI').innerHTML += 'Schwarz';
        break;
      case "Player3":
        document.getElementById('whoAmI').innerHTML += 'Rot';
        break;
      case "Player2":
        document.getElementById('whoAmI').innerHTML += 'Grün';
        break;
      case "Player1":
        document.getElementById('whoAmI').innerHTML += 'Gelb';
        break;
    }
  }

  /**
   * highlights home fields of player that's turn it is by adding css class '.highlightField'
   */
  highlightWhosTurn() {
    let toLoop;
    switch (this.whosTurn) {
      case "Player1":
        toLoop = ['AS_0', 'AS_1', 'AS_2', 'AS_3'];
        break;
      case "Player2":
        toLoop = ['BS_0', 'BS_1', 'BS_2', 'BS_3'];
        break;
      case "Player3":
        toLoop = ['CS_0', 'CS_1', 'CS_2', 'CS_3'];
        break;
      case "Player4":
        toLoop = ['DS_0', 'DS_1', 'DS_2', 'DS_3'];
        break;
    }
    for (let i = 0; i < toLoop.length; i++) {
      let id = 'field_' + toLoop[i].toString();
      if (!(document.getElementById(id).classList.contains('highlightField'))) {
        document.getElementById(id).classList.add('highlightField');
      }
    }
  }

  /**
   * Updates whosTurn and GameID info of GameInfo panel on left
   */
  updateGameInfo() {
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

  /**
   * calls API: /getMoves, called by button 'roll the dice', error handling done with http codes, displaying
   * state of game in DisplayStatus
   */
  getGameData() {
    this.http.get<any>('https://spielehub.server-welt.com/api/getMoves/' + this.gameID.toString(), {
        observe: "response",
        headers: {
          "authorization": this.apiToken,
        },
      },
    ).subscribe(response => {
        if (response.status == 200) {
          //console.log(response['body']);
          this.tossDice(response['body']['move']['dice'], response.body);
        }
      },
      response => {
        if (response.status == 403) {
          console.log('error 403, message:');
          console.log(response['error']['msg']);
          if (response['error']['msg'] == 'make Move first') {
            console.log(response);
            this.highlightMoves(response['error']['moves']);
          } else if (response['error']['msg'] == 'unauthorized') {
            console.log('not your turn, please wait');
            this.updateDisplayStatus('Es ist nicht dein Zug, bitte warten!');
          }
        } else if (response.status == 400) {
          if (response['error']['msg'] == 'notStarted') {
            this.updateDisplayStatus('Das Spiel hat noch nicht gewonnen, bitte warten!');
          }
        } else {
          console.log('other error, can\'t make move');
        }
      });
  }

  /**
   * calls API with /makeMove, sends chosen field and gameID, on success logs response in console and removes all event listeners,
   * on fail logs ('makeMove crashed') and the error
   * @param fieldID
   * @param json
   */
  sendGameData(fieldID: string, json: any) {
    //check for valid call
    if (json[0] == fieldID || json[1] == fieldID ||
      json[2] == fieldID || json[3] == fieldID) {

      this.http.put<any>('https://spielehub.server-welt.com/api/makeMove',
        {
          "move": fieldID,
          "id": this.gameID
        },
        {
          observe: "response",
          headers: {
            "authorization": this.apiToken,
          },
        }
      ).subscribe(response => {
          if (response.status == 200) {
            //remove all event listeners of fields so it can't be send again
            if (json[0] != null && json[0] != '' && json[0] != 'null') {
              let toRemoveOnClick = document.getElementById(json[0]);
              toRemoveOnClick.onclick = () => {
              };
            }
            if (json[1] != null && json[1] != '' && json[1] != 'null') {
              let toRemoveOnClick = document.getElementById(json[1]);
              toRemoveOnClick.onclick = () => {
              };
            }
            if (json[2] != null && json[2] != '' && json[2] != 'null') {
              let toRemoveOnClick = document.getElementById(json[2]);
              toRemoveOnClick.onclick = () => {
              };
            }
            if (json[3] != null && json[3] != '' && json[3] != 'null') {
              let toRemoveOnClick = document.getElementById(json[3]);
              toRemoveOnClick.onclick = () => {
              };
            }
            //console.log(response);
          }
        }, response => {
          console.log('makeMove crashed:');
          console.log(response.error);
        }
      );
    } else {
      this.updateDisplayStatus('Falsches Feld, bitte anderes aussuchen');
    }
  }

  /**
   * Takes every single token and puts them in new position, calls moveTokenToField() for this
   * @param gameBoard: json / ass. array, ['positions'][x] is beeing accessed, has to contain the position
   * of every token from every player
   */
  setPlayerPosition(gameBoard: any) {
    if (gameBoard['positions'][0] != null && gameBoard['positions'][0] != 'null'
      && gameBoard['positions'][1] != null && gameBoard['positions'][1] != 'null'
      && gameBoard['positions'][2] != null && gameBoard['positions'][2] != 'null'
      && gameBoard['positions'][3] != null && gameBoard['positions'][3] != 'null') {
      let colors = ['Yellow', 'Green', 'Red', 'Black'];
      colors.forEach((currentValue, index, array) => {
        for (let i = 1; i < 5; i++) {
          let tokenID = 'token' + i.toString() + '_' + currentValue;
          let fieldID = 'field_' + gameBoard['positions'][index][i - 1];
          this.moveTokenToField(tokenID, fieldID);
        }
      });
    }
  }

  /**
   * animate dice to roll for specific (3s) time, call highlightMoves() when stopped
   * @param randNum: number that shall be displayed by dice after rolling
   * @param jsonReturned: body of request, .move.fields is beeing accessed
   */
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

  /**
   * Highlight the fields that you can make your turn on
   * @param json: [0]-[3] have to be field id's
   */
  highlightMoves(json: any) {
    if (json[0] == null && json[1] == null &&
      json[2] == null && json[3] == null) {
      this.updateDisplayStatus('Keine Züge möglich!');
    } else {
      this.updateDisplayStatus('Mache einen Zug!');
      let fieldToHighlight;
      if (json[0] != null && json[0] != '' && json[0] != 'null') {
        let id = 'field_' + json[0];
        fieldToHighlight = document.getElementById(id);
        fieldToHighlight.classList.add('highlightField');
        fieldToHighlight.onclick = () => {
          this.sendGameData(json[0], json);
        };
      }
      if (json[1] != null && json[1] != '' && json[1] != 'null' && json[1] != json[0]) {
        let id = 'field_' + json[1];
        fieldToHighlight = document.getElementById(id);
        fieldToHighlight.classList.add('highlightField');
        fieldToHighlight.onclick = () => {
          this.sendGameData(json[1], json);
        };
      }
      if (json[2] != null && json[2] != '' && json[2] != 'null' && json[2] != json[0] && json[2] != json[1]) {
        let id = 'field_' + json[2];
        fieldToHighlight = document.getElementById(id);
        fieldToHighlight.classList.add('highlightField');
        fieldToHighlight.onclick = () => {
          this.sendGameData(json[2], json);
        };
      }
      //checks are to prevent same field from having 3 highlights and onclicks
      if (json[3] != null && json[3] != '' && json[3] != 'null' && json[3] != json[0] && json[3] != json[1] && json[3] != json[2]) {
        let id = 'field_' + json[3];
        fieldToHighlight = document.getElementById(id);
        fieldToHighlight.classList.add('highlightField');
        fieldToHighlight.onclick = () => {
          this.sendGameData(json[3], json);
        };
      }
    }
  }

  /**
   * takes all fields with css class '.highlightField' and removes class
   */
  unhiglightMoves() {
    Array.from(document.querySelectorAll('.highlightField')).forEach((el) => el.classList.remove('highlightField'));
  }

  /**
   * appends given token to given field
   * @param token has to be id of token
   * @param field has to be id of field
   */
  moveTokenToField(token: string, field: string): void {
    let tokenElement = document.getElementById(token);
    let fieldElement = document.getElementById(field);
    fieldElement.appendChild(tokenElement);
  }

  //following are only methods for creating game board

  /**
   * Main function for making game field, creates fields, then homes, then finish, gameboard writting
   * and tokens on homefield
   */
  fillGridWithField(): void {
    //general order for players: top right begin, clockwise through the board (bott right, bott left, top left)
    let playerColors = ['green', 'red', 'black', 'gold'];

    this.genertateWalkingFields(playerColors);
    this.generateHomeFields(playerColors);
    this.generateFinishFields(playerColors);
    this.createBoardWritting();
    this.createInitialTokens();
  }

  /**
   * creates a single token
   * @param id id token shall have
   * @param color color token shall have
   */
  generateSingleToken(id: string, color: string): any {
    let token = this.renderer.createElement("div");
    token.setAttribute("id", id);
    token.style.backgroundColor = color;
    token.classList.add("gameBoardToken");
    return token;
  }

  /**
   * create tokens for every player and add them to their home, calls generateSingleToken() for this
   */
  createInitialTokens() {
    let tokenGreen = ['field_BS_0', 'field_BS_1', 'field_BS_2', 'field_BS_3'];
    let tokenRed = ['field_CS_0', 'field_CS_1', 'field_CS_2', 'field_CS_3'];
    let tokenBlack = ['field_DS_0', 'field_DS_1', 'field_DS_2', 'field_DS_3'];
    let tokenYellow = ['field_AS_0', 'field_AS_1', 'field_AS_2', 'field_AS_3'];
    tokenGreen.forEach((currentValue, index, array) => {
      let idOfToken = 'token' + (index + 1) + '_' + 'Green';
      let tokenToAdd = this.generateSingleToken(idOfToken, 'lightgreen');
      this.renderer.appendChild(document.getElementById(currentValue), tokenToAdd);
    });
    tokenRed.forEach((currentValue, index, array) => {
      let idOfToken = 'token' + (index + 1) + '_' + 'Red';
      let tokenToAdd = this.generateSingleToken(idOfToken, 'lightcoral');
      this.renderer.appendChild(document.getElementById(currentValue), tokenToAdd);
    });
    tokenBlack.forEach((currentValue, index, array) => {
      let idOfToken = 'token' + (index + 1) + '_' + 'Black';
      let tokenToAdd = this.generateSingleToken(idOfToken, 'darkgrey');
      this.renderer.appendChild(document.getElementById(currentValue), tokenToAdd);
    });
    tokenYellow.forEach((currentValue, index, array) => {
      let idOfToken = 'token' + (index + 1) + '_' + 'Yellow';
      let tokenToAdd = this.generateSingleToken(idOfToken, 'yellow');
      this.renderer.appendChild(document.getElementById(currentValue), tokenToAdd);
    });
  }

  /**
   * making walking fields for every player of scheme AR_1, A is player, _1 is field number (0-9)
   * @param playerColors array with ['green','red','black','gold'] etc.
   */
  genertateWalkingFields(playerColors: string[]) {
    //create all normal walking fields
    let walkingFields = ['BR_1', 'BR_2', 'BR_3', 'BR_4', 'BR_5', 'BR_6', 'BR_7', 'BR_8', 'BR_9'];
    walkingFields.push('CR_1', 'CR_2', 'CR_3', 'CR_4', 'CR_5', 'CR_6', 'CR_7', 'CR_8', 'CR_9');
    walkingFields.push('DR_1', 'DR_2', 'DR_3', 'DR_4', 'DR_5', 'DR_6', 'DR_7', 'DR_8', 'DR_9');
    walkingFields.push('AR_1', 'AR_2', 'AR_3', 'AR_4', 'AR_5', 'AR_6', 'AR_7', 'AR_8', 'AR_9');
    walkingFields.forEach((currentValue, index, array) => {
      let coordinatesForField = 'field_' + currentValue;
      let element = this.generateSingleField(coordinatesForField, 'white', true);
      this.renderer.appendChild(document.getElementById(currentValue), element);
    });

    //creating the start fields
    let startFields = ['BR_0', 'CR_0', 'DR_0', 'AR_0'];
    playerColors.forEach((currentValue, index, array) => {
      let coordinatesForField = 'field_' + startFields[index];
      let element = this.generateSingleField(coordinatesForField, currentValue, true);
      this.renderer.appendChild(document.getElementById(startFields[index]), element);
    });
  }

  /**
   * makes single field div (running, home, finish)
   * @param coordinates id field shall have (so the coordinates)
   * @param color color field shall have, has to be css color value
   * @param isBig true for big field (running), false for little field (finish or home)
   */
  generateSingleField(coordinates: string, color: string, isBig: Boolean): any {
    let element = this.renderer.createElement("div");
    element.setAttribute("id", coordinates);
    if (isBig) {
      element.classList.add("field-gameboard");
    } else {
      element.classList.add('field-startFinish');
    }
    element.style.backgroundColor = color;

    return element;
  }

  /**
   * generate home fields for every color
   * @param playerColors array with ['green','red','black','gold'] etc.
   */
  generateHomeFields(playerColors: string[]) {
    let homeFields = ['BS_0', 'BS_1', 'BS_2', 'BS_3']; //green top right
    homeFields.push('CS_0', 'CS_1', 'CS_2', 'CS_3'); //red bottom right
    homeFields.push('DS_0', 'DS_1', 'DS_2', 'DS_3'); //black bottom left
    homeFields.push('AS_0', 'AS_1', 'AS_2', 'AS_3'); //yellow top left

    homeFields.forEach((currentValue, index, array) => {
      let coordinatesForField = 'field_' + currentValue;
      let element = this.generateSingleField(coordinatesForField, playerColors[Math.trunc(index / 4)], false);
      this.renderer.appendChild(document.getElementById(currentValue), element);
    });
  }

  /**
   * Make finish fields for every player
   * @param playerColors array with ['grün','gelb'...] etc.
   */
  generateFinishFields(playerColors: string[]) {
    let finishFields = ['BF_0', 'BF_1', 'BF_2', 'BF_3'];
    finishFields.push('CF_0', 'CF_1', 'CF_2', 'CF_3');
    finishFields.push('DF_0', 'DF_1', 'DF_2', 'DF_3');
    finishFields.push('AF_0', 'AF_1', 'AF_2', 'AF_3');

    finishFields.forEach((currentValue, index, array) => {
      let coordinatesForField = 'field_' + currentValue;
      let element = this.generateSingleField(coordinatesForField, playerColors[Math.trunc(index / 4)], false);
      this.renderer.appendChild(document.getElementById(currentValue), element);
    });
  }

  /**
   * Creates 'Mensch ärgere dich nicht' writting on gameboard
   */
  createBoardWritting() {
    let boardWritting = this.renderer.createElement("div");
    boardWritting.setAttribute("id", 'boardWritting_top_left');
    boardWritting.innerText = 'Mensch';
    boardWritting.classList.add('boardWrittingTop');
    this.renderer.appendChild(document.getElementById('ul_r_3_c_3'), boardWritting);

    boardWritting = this.renderer.createElement("div");
    boardWritting.setAttribute("id", 'boardWritting_top_right');
    boardWritting.innerText = 'ärgere';
    boardWritting.classList.add('boardWrittingTop');
    this.renderer.appendChild(document.getElementById('ur_r_3_c_2'), boardWritting);

    boardWritting = this.renderer.createElement("div");
    boardWritting.setAttribute("id", 'boardWritting_bottom_left');
    boardWritting.innerText = 'dich';
    boardWritting.classList.add('boardWrittingBottom');
    this.renderer.appendChild(document.getElementById('bl_r_1_c_3'), boardWritting);

    boardWritting = this.renderer.createElement("div");
    boardWritting.setAttribute("id", 'boardWritting_bottom_right');
    boardWritting.innerText = 'nicht';
    boardWritting.classList.add('boardWrittingBottom');
    this.renderer.appendChild(document.getElementById('br_r_1_c_2'), boardWritting);
  }

  //here is the code for the modal

  modalIsVisible: boolean;

  handleCancel() {
    this.modalIsVisible = false;
  }
}

//firework win animation:
//from 'https://codepen.io/kitjenson/pen/oNGMgWo'

let fw_spread = 180 // how wide the particles expand
let fw_scale = 10 // how large the particles get
let fw_launch_rate = 100 // in milliseconds

function createFirework() {
  let f = document.createElement('div')
  f.className = 'firework'
  f.style.width = '3px'
  f.style.height = '3px'
  f.style.position = 'absolute'
  let fx = Math.random() * 100 + '%'
  f.style.left = Math.random() * 33 + 33 + '%'
  f.style.top = '100%'
  let clr = 'hsl(' + Math.random() * 360 + 'deg,100%,50%)'
  // f.style.backgroundColor = clr
  f.style.transition = 'ease-out ' + (Math.random() * 3) + 1 + 's'

  document.getElementById('gameboard').appendChild(f);
//  document.body.appendChild(f)

  for (let i = 0; i < 25; i++) {
    let p = document.createElement('div')
    p.className = 'particle'
    p.style.width = '100%'
    p.style.height = '100%'
    p.style.backgroundColor = clr
    p.style.position = 'absolute'
    p.style.left = '0'
    p.style.top = '0'
    p.style.transition = '.5s'
    f.appendChild(p)
  }

  setTimeout(function () {
    f.style.top = Math.random() * 50 + 5 + '%'
    f.style.left = fx
    f.ontransitionend = function () {
      let p = document.querySelectorAll('.particle')
      p.forEach(function (elm: any) {
        let x = Math.random() < .5 ? Math.random() * fw_spread : (-1) * Math.random() * fw_spread
        let y = Math.random() < .5 ? Math.random() * fw_spread : (-1) * Math.random() * fw_spread
        elm.style.left = x + 'px'
        elm.style.top = y + 'px'
        elm.style.opacity = '0'
        elm.style.transform = 'scale(' + fw_scale + ')'
        elm.style.borderRadius = '50%'
        elm.style.filter = 'blur(1px)'
        elm.ontransitionend = function () {
          this.remove()
        }
      })
      setTimeout(function () {
        f.remove()
      }, 1000)
    }
  }, 100)

  setTimeout(createFirework, fw_launch_rate)
}

// window.addEventListener('click', createFirework)

