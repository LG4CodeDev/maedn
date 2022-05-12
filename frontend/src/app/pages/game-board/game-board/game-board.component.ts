import {Component, ElementRef, Inject, OnInit, Renderer2} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { DOCUMENT} from "@angular/common";
import { Router } from '@angular/router';

@Component({
  selector: 'app-game-board',
  //templateUrl: './game-board.component.html',
  template: `
    <div nz-row>
      <div nz-col class="side-left" nzFlex="auto">
        <div class="whosTurnIsIt">
          Es ist dran:
          <div id="whosTurnIsIt">

          </div>
        </div>
        <div class="whosTurnIsIt">
          Du bist Farbe:
          <div id="whoAmI">

          </div>
        </div>
      </div>
      <div nz-col class="game" nzXs="12" nzSm="12" nzMd="12" nzLg="12" nzXl="12">
          <div nz-row class="row">
            <div nz-col class="board" id="ul">
              <div nz-row class="row_4_4" id="ul_r_1">
                <div nz-col class="col_4_4" id="AS_0"></div>
                <div nz-col class="col_4_4" id="AS_1"></div>
                <div nz-col class="col_4_4" id="ul_r_1_c_3"></div>
                <div nz-col class="col_4_4" id="ul_r_1_c_4"></div>
              </div>
              <div nz-row class="row_4_4" id="ul_r_2">
                <div nz-col class="col_4_4" id="AS_2"></div>
                <div nz-col class="col_4_4" id="AS_3"></div>
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
                <div nz-col class="col_4_3" id="AR_8"></div>
                <div nz-col class="col_4_3" id="AR_9"></div>
                <div nz-col class="col_4_3" id="BR_0"></div>
              </div>
              <div nz-row class="row_4_3" id="um_r_2">
                <div nz-col class="col_4_3" id="AR_7"></div>
                <div nz-col class="col_4_3" id="BF_0"></div>
                <div nz-col class="col_4_3" id="BR_1"></div>
              </div>
              <div nz-row class="row_4_3" id="um_r_3">
                <div nz-col class="col_4_3" id="AR_6"></div>
                <div nz-col class="col_4_3" id="BF_1"></div>
                <div nz-col class="col_4_3" id="BR_2"></div>
              </div>
              <div nz-row class="row_4_3" id="um_r_4">
                <div nz-col class="col_4_3" id="AR_5"></div>
                <div nz-col class="col_4_3" id="BF_2"></div>
                <div nz-col class="col_4_3" id="BR_3"></div>
              </div>
            </div>
            <div nz-col class="board" id="ur">
              <div nz-row class="row_4_4" id="ur_r_1">
                <div nz-col class="col_4_4" id="ur_r_1_c_1"></div>
                <div nz-col class="col_4_4" id="ur_r_1_c_2"></div>
                <div nz-col class="col_4_4" id="BS_0"></div>
                <div nz-col class="col_4_4" id="BS_1"></div>
              </div>
              <div nz-row class="row_4_4" id="ur_r_2">
                <div nz-col class="col_4_4" id="ur_r_2_c_1"></div>
                <div nz-col class="col_4_4" id="ur_r_2_c_2"></div>
                <div nz-col class="col_4_4" id="BS_2"></div>
                <div nz-col class="col_4_4" id="BS_3"></div>
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
                <div nz-col class="col_3_4" id="AR_0"></div>
                <div nz-col class="col_3_4" id="AR_1"></div>
                <div nz-col class="col_3_4" id="AR_2"></div>
                <div nz-col class="col_3_4" id="AR_3"></div>
              </div>
              <div nz-row class="row_3_4" id="ml_r_2">
                <div nz-col class="col_3_4" id="DR_9"></div>
                <div nz-col class="col_3_4" id="AF_0"></div>
                <div nz-col class="col_3_4" id="AF_1"></div>
                <div nz-col class="col_3_4" id="AF_2"></div>
              </div>
              <div nz-row class="row_3_4" id="ml_r_3">
                <div nz-col class="col_3_4" id="DR_8"></div>
                <div nz-col class="col_3_4" id="DR_7"></div>
                <div nz-col class="col_3_4" id="DR_6"></div>
                <div nz-col class="col_3_4" id="DR_5"></div>
              </div>
            </div>
            <div nz-col class="board" id="mm">
              <div nz-row class="row_3_3" id="mm_r_1">
                <div nz-col class="col_3_3" id="AR_4"></div>
                <div nz-col class="col_3_3" id="BF_3"></div>
                <div nz-col class="col_3_3" id="BR_4"></div>
              </div>
              <div nz-row class="row_3_3" id="mm_r_2">
                <div nz-col class="col_3_3" id="AF_3"></div>
                <div nz-col class="col_3_3" id="mm_r_2_c_2"></div>
                <div nz-col class="col_3_3" id="CF_3"></div>
              </div>
              <div nz-row class="row_3_3" id="mm_r_3">
                <div nz-col class="col_3_3" id="DR_4"></div>
                <div nz-col class="col_3_3" id="DF_3"></div>
                <div nz-col class="col_3_3" id="CR_4"></div>
              </div>
            </div>
            <div nz-col class="board" id="mr">
              <div nz-row class="row_3_4" id="mr_r_1">
                <div nz-col class="col_3_4" id="BR_5"></div>
                <div nz-col class="col_3_4" id="BR_6"></div>
                <div nz-col class="col_3_4" id="BR_7"></div>
                <div nz-col class="col_3_4" id="BR_8"></div>
              </div>
              <div nz-row class="row_3_4" id="mr_r_2">
                <div nz-col class="col_3_4" id="CF_2"></div>
                <div nz-col class="col_3_4" id="CF_1"></div>
                <div nz-col class="col_3_4" id="CF_0"></div>
                <div nz-col class="col_3_4" id="BR_9"></div>
              </div>
              <div nz-row class="row_3_4" id="mr_r_3">
                <div nz-col class="col_3_4" id="CR_3"></div>
                <div nz-col class="col_3_4" id="CR_2"></div>
                <div nz-col class="col_3_4" id="CR_1"></div>
                <div nz-col class="col_3_4" id="CR_0"></div>
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
                <div nz-col class="col_4_4" id="DS_0"></div>
                <div nz-col class="col_4_4" id="DS_1"></div>
                <div nz-col class="col_4_4" id="bl_r_3_c_3"></div>
                <div nz-col class="col_4_4" id="bl_r_3_c_4"></div>
              </div>
              <div nz-row class="row_4_4" id="bl_r_4">
                <div nz-col class="col_4_4" id="DS_2"></div>
                <div nz-col class="col_4_4" id="DS_3"></div>
                <div nz-col class="col_4_4" id="bl_r_4_c_3"></div>
                <div nz-col class="col_4_4" id="bl_r_4_c_4"></div>
              </div>
            </div>
            <div nz-col class="board" id="bm">
              <div nz-row class="row_4_3" id="bm_r_1">
                <div nz-col class="col_4_3" id="DR_3"></div>
                <div nz-col class="col_4_3" id="DF_2"></div>
                <div nz-col class="col_4_3" id="CR_5"></div>
              </div>
              <div nz-row class="row_4_3" id="bm_r_2">
                <div nz-col class="col_4_3" id="DR_2"></div>
                <div nz-col class="col_4_3" id="DF_1"></div>
                <div nz-col class="col_4_3" id="CR_6"></div>
              </div>
              <div nz-row class="row_4_3" id="bm_r_3">
                <div nz-col class="col_4_3" id="DR_1"></div>
                <div nz-col class="col_4_3" id="DF_0"></div>
                <div nz-col class="col_4_3" id="CR_7"></div>
              </div>
              <div nz-row class="row_4_3" id="bm_r_4">
                <div nz-col class="col_4_3" id="DR_0"></div>
                <div nz-col class="col_4_3" id="CR_9"></div>
                <div nz-col class="col_4_3" id="CR_8"></div>
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
                <div nz-col class="col_4_4" id="CS_0"></div>
                <div nz-col class="col_4_4" id="CS_1"></div>
              </div>
              <div nz-row class="row_4_4" id="br_r_4">
                <div nz-col class="col_4_4" id="br_r_4_c_1"></div>
                <div nz-col class="col_4_4" id="br_r_4_c_2"></div>
                <div nz-col class="col_4_4" id="CS_2"></div>
                <div nz-col class="col_4_4" id="CS_3"></div>
              </div>
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
        <button id="accordion">Regeln</button>
        <div nz-row id="regeln">
          <p class="regeln_header">Spielstart</p>
          <p class="regeln_text">
            Jeder Spieler erhählt 4 Spielfiguren in seiner eigenen Farbe.
            Zu Beginn stehen diese im so genannten "Haus" in der jeweils farbig markierten Ecke des Spielfelds.
            Die Spieler müssen nun nacheinander versuchen eine 6 zu würfeln um damit einen Spielstein aus ihrem Haus auf
            das Spielfeld zu bringen.
            Solange ein Spieler keine Figur auf dem Spielfeld besitzt darf dieser pro Runde drei Mal versuchen eine 6 zu
            würfeln.
            Sobald eine 6 gewürfelt wurde, muss der Spieler eine Figur aus dem Haus auf das farbig markierte Anfangsfeld
            setzen.
            Er erhählt nun einen zweiten Wurf, mit dem er diese Figur weiterrücken muss.
          </p>
          <p class="regeln_header">Spielablauf</p>
          <p class="regeln_text">
            Hat ein Spieler eine Figur auf dem Feld, dann darf er pro Runde nur noch ein Mal würfeln.
            Anschließend darf er eine beliebige Figur von sich, welche sich jedoch auf dem Spielfeld befinden muss, um
            die gewürfelte Augenzahl weiterziehen.
            Würfelt ein Spieler eine 6 erhält er einen weiteren Wurf. Befindet sich zu dem Zeitpunkt noch mindestens
            eine Figur in seinem Haus, dann muss diese zuerst auf das Anfangsfeld von ihm gezogen werden.
            Der zweite Wurf darf dann nur noch mit der Person auf dem Anfangsfeld vollzogen werden.
            Hat ein Spieler keine Figuren mehr im Haus, so erhält er trotzdem einen weiteren Wurf und darf mit
            beliebigem ihm gehörenden Figuren ziehen.
            Kommt ein Spieler auf ein Feld mit einer fremden oder eigenen Figur, dann schlägt er diese.
            Das bedeutet, dass die Figur zurück in das zugehörige Haus versetzt wird.
          </p>
          <p class="regeln_header">Spielende</p>
          <p class="regeln_text">
            Ziel des Spiels ist es, alle seine Figuren in das eigene Ziel zu bringen. Das sind die 4 farbig markierten
            Felder in der Mitte des Spielfelds.
            Hat eine Figur das äußere Kreuz vollständig umrudet kann es auf die Kreise ihrer Farbe ins Ziel.
            Dazu muss jedoch die genaue Augenzahl für ein freies Zielfeld erwürfelt werden. Geschieht das nicht, kann
            entweder mit einer anderen Figur gezogen werden oder der Spielzug wird beendet.
          </p>
        </div>
        <div nz-row id="dice" nzJustify="center">
          <div class="scene">
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
          <button class="rollBtn" (click)="getGameData()">Roll the Dice</button>
        </div>
      </div>
  `,
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
  jsonReturned: any;
  gameID: number;
  userID: number;
  highlightetFields: any;

  ngOnInit(): void {
    this.gameID = 29;
    try{
      this.userID = JSON.parse(localStorage.getItem('currentUser')).userid;
    }
    catch (e) {
      this.router.navigate(['/login']);
    }

    this.apiToken = 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token;
    this.highlightetFields = [];
    if (!!window.EventSource) {

      var source = new EventSource('https://spielehub.server-welt.com/startStream/'+this.userID.toString());
      source.addEventListener('message', function(e) {
        console.log('sse tut');
        console.log(e)
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
    this.getPlayerPositions();
  }

  getPlayerPositions(){
    this.http.get<any>('https://spielehub.server-welt.com/api/getMainGame/'+this.gameID.toString(),{
        observe: "response",
        headers: {
          "authorization": this.apiToken,
        },
      },
    ).subscribe(response => {
        console.log(response)
        this.setPlayerPosition(response['body']);
        let nextPlayer = 'Player4';
        switch (nextPlayer) {
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
        document.getElementById('whoAmI').innerHTML = '';
        if(response['body']['Player1'] == this.userID){
          document.getElementById('whoAmI').innerHTML += 'Gelb';
        }
        if(response['body']['Player2'] == this.userID){
          document.getElementById('whoAmI').innerHTML += 'Grün';
        }
        if(response['body']['Player3'] == this.userID){
          document.getElementById('whoAmI').innerHTML += 'Rot';
        }
        if(response['body']['Player4'] == this.userID){
          document.getElementById('whoAmI').innerHTML += 'Schwarz';
        }
      },
      response => {
        console.log(response)
      }
    )
  }

  getGameData(){
    this.http.get<any>('https://spielehub.server-welt.com/api/getMoves/'+this.gameID.toString(),{
        observe: "response",
        headers: {
          "authorization": this.apiToken,
        },
      },
    ).subscribe(response => {
      console.log(response.status)
      if (response.status == 200) {
        console.log(response['body']);
        this.jsonReturned = response['body'];
        this.tossDice(response['body']['move']['dice'])
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
    console.log(json[0]);
    console.log(fieldID);
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
          console.log('game data successfully send!');
          console.log(response);
          this.unhiglightMoves(this.jsonReturned);
          this.setPlayerPosition(response['body']);
        }
      });
    }
    else{
      console.log('incorrect field, choose another');
    }
  }

  setPlayerPosition(gameBoard: any){
    if(gameBoard['positions'][0] != null && gameBoard['positions'][1] != null
    && gameBoard['positions'][2] != null && gameBoard['positions'][3] != null){
      let colors = ['Yellow', 'Green', 'Red', 'Black'];
      colors.forEach((currentValue, index, array) => {
        for (let i = 1; i < 5; i++) {
          let tokenID = 'token' +i.toString() + '_' + currentValue;
          let fieldID = 'field_'+gameBoard['positions'][index][i-1];
          //console.log('moving ' + tokenID + ' to field ' + fieldID);
          this.moveTokenToField(tokenID, fieldID);
        }
      });
      //this.moveTokenToField()
    }
  }

  tossDice(randNum: number) {
    const cube = document.getElementById('cube');
    cube.className = "";

    cube.classList.add('is-spinning-' + randNum);
    cube.addEventListener("animationend", () => {
      cube.classList.remove("is-spinning-" + randNum);
      const showClass = 'show-' + randNum;
      cube.classList.add(showClass);
      console.log(randNum)
      this.highlightMoves(this.jsonReturned['move']['fields']);

    }, {once: true});
  }

  highlightMoves(json: any){
    if (json[0] == null && json[1] == null &&
      json[2] == null && json[3] == null) {
        console.log('no moves available');
      }
    else {
      let fieldToHighlight;
      if (json[0] != '' && json[0] != null) {
        let id = 'field_' + json[0];
        fieldToHighlight = document.getElementById(id);
        fieldToHighlight.classList.add('highlightField');
        fieldToHighlight.addEventListener('click', () => this.sendGameData(json[0], json));
      }
      if (json[1] != '' && json[1] != null) {
        let id = 'field_' + json[1];
        fieldToHighlight = document.getElementById(id);
        fieldToHighlight.classList.add('highlightField');
        fieldToHighlight.addEventListener('click', () => this.sendGameData(json[1], json));
      }
      if (json[2] != '' && json[2] != null) {
        let id = 'field_' + json[2];
        fieldToHighlight = document.getElementById(id);
        fieldToHighlight.classList.add('highlightField');
        fieldToHighlight.addEventListener('click', () => this.sendGameData(json[2], json));
      }
      if (json[3] != '' && json[3] != null) {
        let id = 'field_' + json[3];
        fieldToHighlight = document.getElementById(id);
        fieldToHighlight.classList.add('highlightField');
        fieldToHighlight.addEventListener('click', () => this.sendGameData(json[3], json));
      }
      this.highlightetFields.push(fieldToHighlight);
    }
  }

  unhiglightMoves(json: any){
    console.log(this.highlightetFields);
    this.highlightetFields.forEach((currentValue: HTMLElement, index: any, array: any) => {
      currentValue.classList.remove('highlightField');
    });
    this.highlightetFields = [];
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
  }

  //following are only methods for creating game board,
  //TODO: auslagern

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

}
