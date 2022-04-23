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
  constructor() { }

  ngOnInit(): void {
    this.fillGridWithField();
  }

  fillGridWithField(): void {
    var element = this.generateSingleField('ur:1:1', '0x000000', 'test', true);
    document.getElementById('ur').appendChild(element);
  }

  generateSingleField(coordinates: string, color: string, content: string, isBig: Boolean): any{
    var element = document.createElement("div");
    element.setAttribute("id", coordinates);
    if (isBig){
      element.classList.add('field-gameboard');
    }
    else{
      element.classList.add('field-startFinish');
    }
    element.style.backgroundColor = color;
    element.innerText = content;
    return element;
  }

}
