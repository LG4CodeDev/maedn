import {Component, ElementRef, Inject, OnInit, Renderer2} from '@angular/core';
import { DOCUMENT} from "@angular/common";

@Component({
  selector: 'app-game-board',
  //templateUrl: './game-board.component.html',
  template: `
    <div nz-row>
      <div nz-col class="side" nzFlex="auto">

      </div>
      <div nz-col class="game" nzFlex="15">
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
      <div nz-col class="side" nzFlex="auto">
        <div nz-row></div>
        <div nz-row></div>
        <div nz-row id="dice">
          <div class = 'dice-container'>
            <div class='dice'>
              <div class='face' data-id='1'>
                <div class="point point-middle point-center">
                </div>
              </div>
              <div class='face' data-id='2'>
                <div class="point point-top point-right">
                </div>
                <div class="point point-bottom point-left">
                </div>
              </div>
              <div class='face' data-id='6'>
                <div class="point point-top point-right">
                </div>
                <div class="point point-top point-left">
                </div>
                <div class="point point-middle point-right">
                </div>
                <div class="point point-middle point-left">
                </div>
                <div class="point point-bottom point-right">
                </div>
                <div class="point point-bottom point-left">
                </div>
              </div>
              <div class='face' data-id='5'>
                <div class="point point-top point-right">
                </div>
                <div class="point point-top point-left">
                </div>
                <div class="point point-middle point-center">
                </div>
                <div class="point point-bottom point-right">
                </div>
                <div class="point point-bottom point-left">
                </div>
              </div>
              <div class='face' data-id='3'>
                <div class="point point-top point-right">
                </div>
                <div class="point point-middle point-center">
                </div>
                <div class="point point-bottom point-left">
                </div>
              </div>
              <div class='face' data-id='4'>
                <div class="point point-top point-right">
                </div>
                <div class="point point-top point-left">
                </div>
                <div class="point point-bottom point-right">
                </div>
                <div class="point point-bottom point-left">
                </div>
              </div>
            </div>
          </div>
        </div>
        <button class="roll-btn">ROLL</button>
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

  ngOnInit(): void {

    this.fillGridWithField();
  }

  fillGridWithField(): void {
    //general order for players: top right begin, clockwise through the board (bott right, bott left, top left)
    let playerColors = ['green','red','black','yellow'];

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

    let homeFields = ['ur_r_1_c_3','ur_r_1_c_4','ur_r_2_c_3','ur_r_2_c_4']; //green top right
    homeFields.push('br_r_3_c_3','br_r_3_c_4','br_r_4_c_3','br_r_4_c_4'); //red bottom right
    homeFields.push('bl_r_3_c_1','bl_r_3_c_2','bl_r_4_c_1','bl_r_4_c_2'); //black bottom left
    homeFields.push('ul_r_1_c_1','ul_r_1_c_2','ul_r_2_c_1','ul_r_2_c_2'); //yellow top left

    homeFields.forEach((currentValue, index, array) => {
      let coordinatesForField = 'field_' + currentValue;
      let element = this.generateSingleField(coordinatesForField, playerColors[Math.trunc(index/4)], '', false);
      this.renderer.appendChild(document.getElementById(currentValue), element);
    });

    let finishFields = ['um_r_2_c_2','um_r_3_c_2','um_r_4_c_2','mm_r_1_c_2'];
    finishFields.push('mr_r_2_c_3','mr_r_2_c_2','mr_r_2_c_1','mm_r_2_c_3');
    finishFields.push('bm_r_3_c_2','bm_r_2_c_2','bm_r_1_c_2','mm_r_3_c_2');
    finishFields.push('ml_r_2_c_2','ml_r_2_c_3','ml_r_2_c_4','mm_r_2_c_1');

    finishFields.forEach((currentValue, index, array) => {
      let coordinatesForField = 'field_' + currentValue;
      let element = this.generateSingleField(coordinatesForField, playerColors[Math.trunc(index/4)], '', false);
      this.renderer.appendChild(document.getElementById(currentValue), element);
    });

    var boardWritting =  this.renderer.createElement("div");
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

  generateSingleField(coordinates: string, color: string, content: string, isBig: Boolean): any{
    var element = this.renderer.createElement("div");
    element.setAttribute("id", coordinates);
    if (isBig){
      element.classList.add("field-gameboard");
    }
    else{
      element.classList.add('field-startFinish');
    }
    element.style.backgroundColor = color;
    element.innerText = content;
    return element;
  }
}
