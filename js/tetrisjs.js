"use strict";

const I = [
  [0, 0, 0, 0],
  [1, 1, 1, 1],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];
const J = [
  [2, 0, 0],
  [2, 2, 2],
  [0, 0, 0],
];
const L = [
  [0, 0, 3],
  [3, 3, 3],
  [0, 0, 0],
];
const O = [
  [4, 4],
  [4, 4],
];
const S = [
  [0, 5, 5],
  [5, 5, 0],
  [0, 0, 0],
];
const Z = [
  [6, 6, 0],
  [0, 6, 6],
  [0, 0, 0],
];
const T = [
  [0, 7, 0],
  [7, 7, 7],
  [0, 0, 0],
];
const figures = [I, J, L, O, S, Z, T];
let randomFigure; //random element from array of figures
let figure; //current figure
let speed; //fall speed, ms
let speedGame = 1; //game speed
let recordGame = 0; //game record
let numElem = 0; //element number
let posX = 4; //figure start position/figure shift
let posY = 0; //figure start position/figure shift
let stop = false; //sign of stopping the game
let closeWindow = false; //sign that the game end field is hidden
const fieldClone = []; //array of game field
const startGameScreen = document.getElementById("startGame");
const endGameScreen = document.getElementById("endGame");
refreshData();
createField();
clearTable();

function gamePreparation() {
  let form = document.forms.my;
  let speedG = form.elements.speedGame;
  speedGame = +speedG.value;
  numElem = 0;
  stop = false;
  startGameScreen.style.visibility = "hidden";
  speed = 600 - speedGame * 50;
  refreshData();
  clearTable();
  startGame();
}

function startGame() {
  if (stop) return;
  randomFigure = Math.floor(Math.random() * figures.length);
  figure = figures[randomFigure];
  posX = 4;
  posY = 0;
  if (!checkPossibility()) {
    closeWindow = false;
    endGames();
  } else drowing(posX, posY);

  fallingFigure();
}

document.addEventListener("keydown", function (event) {
  if (event.key == "ArrowLeft") posLeft(posY); //left shift
  if (event.key == "ArrowRight") posRight(posY); //right shift
  if (event.key == "ArrowUp") posTurn(); //turn figure
  if (event.key == "ArrowDown") speed = 10; //speed falling Figure
  if (event.key == "Escape") endGames(); //game end
});

function posLeft(posY) {
  if (stop) return;
  let leftX;
  label: for (let i = 0; i < figure.length; i++) {
    for (let j = 0; j < figure[i].length; j++) {
      if (figure[i][j] !== 0) {
        leftX = i;
        break label;
      }
    }
  }
  if (posX + leftX > 0 && checkPossibility()) posX -= 1;
  if (!checkPossibility()) {
    posX += 1;
    return false;
  }
  updating();
  drowing(posX, posY);
}

function posRight(posY) {
  if (stop) return;
  let rightX;
  label: for (let i = 0; i < figure.length; i++) {
    for (let j = figure.length - 1; j >= 0; j--) {
      if (figure[i][j] !== 0) {
        rightX = i;
        continue label;
      }
    }
  }
  if (posX < fieldClone.length - rightX - 1) posX += 1;
  if (!checkPossibility()) {
    posX -= 1;
    return false;
  }
  updating();
  drowing(posX, posY);
}

function posTurn() {
  if (stop) return;
  let turnT = [];
  for (let i = 0; i < figure.length; i++) {
    turnT[i] = [];
    for (let j = 0; j < figure[i].length; j++) {
      turnT[i][j] = figure[j][figure[i].length - 1 - i];
      if (fieldClone[i + posX][j + posY] == undefined) return;
    }
  }
  figure = turnT;
  return figure;
}

function fallingFigure() {
  if (stop) return;
  setTimeout(function () {
    if (stop) return;
    posY += 1;
    for (let i = 0; i < figure.length; i++) {
      for (let j = 0; j < figure[i].length; j++) {
        let crash = figure[i][j] !== 0 && fieldClone[i + posX][j + posY] !== 0;
        if (crash) {
          for (let i = 0; i < figure.length; i++) {
            for (let j = 0; j < figure[i].length; j++) {
              if (figure[i][j] !== 0)
                fieldClone[posX + i][posY - 1 + j] = figure[i][j];
            }
          }
          deletedLine(fieldClone);
          numElem += 1;
          // increase of speed every 10 elements
          if (numElem % 10 == 0) speedGame += 1;
          if (speedGame >= 10) speedGame = 10;
          speed = 600 - speedGame * 50;
          refreshData();
          startGame();
          return false;
        }
      }
    }
    updating();
    drowing(posX, posY);
    fallingFigure();
  }, speed);
}

function endGames() {
  if (recordGame < numElem) recordGame = numElem;
  refreshData();
  stop = true;
  endGameScreen.style.visibility = "visible";
  if (closeWindow) {
    endGameScreen.style.visibility = "hidden";
    clearTable();
  }
  closeWindow = true;
  numElem = 0;
}

function deletedLine(fieldClone) {
  label1: for (let j = 19; j >= 0; ) {
    let line;
    for (let i = 0; i <= 9; i++) {
      if (fieldClone[i][j] == 0) {
        j--;
        continue label1;
      } else {
        line = j;
      }
    }
    for (let y = line; y > 0; y--) {
      for (let i = 0; i <= 9; i++) {
        if (fieldClone[i][y - 1] == undefined) {
          fieldClone[i][y - 1] = 0;
        }
        fieldClone[i][y] = fieldClone[i][y - 1];
      }
    }
  }
  updating();
  return fieldClone;
}

function updating() {
  for (let i = 0; i <= 9; i++) {
    for (let j = 0; j <= 19; j++) {
      if (fieldClone[i][j] == 0) {
        fieldGame.rows[j].cells[i].style.backgroundColor = "#BBBBBB";
      }
      if (fieldClone[i][j] == 1) {
        fieldGame.rows[j].cells[i].style.backgroundColor = "#FF0000";
      }
      if (fieldClone[i][j] == 2) {
        fieldGame.rows[j].cells[i].style.backgroundColor = "#FF4500";
      }
      if (fieldClone[i][j] == 3) {
        fieldGame.rows[j].cells[i].style.backgroundColor = "#FFFF00";
      }
      if (fieldClone[i][j] == 4) {
        fieldGame.rows[j].cells[i].style.backgroundColor = "#00FF00";
      }
      if (fieldClone[i][j] == 5) {
        fieldGame.rows[j].cells[i].style.backgroundColor = "#00FFFF";
      }
      if (fieldClone[i][j] == 6) {
        fieldGame.rows[j].cells[i].style.backgroundColor = "#0000FF";
      }
      if (fieldClone[i][j] == 7) {
        fieldGame.rows[j].cells[i].style.backgroundColor = "#800080";
      }
    }
  }
}

function drowing(posX, posY) {
  for (let i = 0; i < figure.length; i++) {
    for (let j = 0; j < figure[i].length; j++) {
      if (figure[i][j] == 1) {
        fieldGame.rows[j + posY].cells[i + posX].style.backgroundColor =
          "#FF0000";
      }
      if (figure[i][j] == 2) {
        fieldGame.rows[j + posY].cells[i + posX].style.backgroundColor =
          "#FF4500";
      }
      if (figure[i][j] == 3) {
        fieldGame.rows[j + posY].cells[i + posX].style.backgroundColor =
          "#FFFF00";
      }
      if (figure[i][j] == 4) {
        fieldGame.rows[j + posY].cells[i + posX].style.backgroundColor =
          "#00FF00";
      }
      if (figure[i][j] == 5) {
        fieldGame.rows[j + posY].cells[i + posX].style.backgroundColor =
          "#00FFFF";
      }
      if (figure[i][j] == 6) {
        fieldGame.rows[j + posY].cells[i + posX].style.backgroundColor =
          "#0000FF";
      }
      if (figure[i][j] == 7) {
        fieldGame.rows[j + posY].cells[i + posX].style.backgroundColor =
          "#800080";
      }
    }
  }
}

function clearTable() {
  for (let i = 0; i <= 9; i++) {
    fieldClone[i] = [];
    for (let j = 0; j <= 19; j++) {
      fieldClone[i][j] = 0;
      fieldGame.rows[j].cells[i].style.backgroundColor = "#BBBBBB";
    }
  }
}

function createField() {
  for (let j = 0; j < 20; j++) {
    let tr = document.createElement("tr");
    for (let i = 0; i < 10; i++) {
      const td = document.createElement("td");
      td.className = "field__left-cage";
      tr.append(td);
    }
    fieldGame.append(tr);
  }
}

function checkPossibility() {
  for (let i = 0; i < figure.length; i++) {
    for (let j = 0; j < figure[i].length; j++) {
      if (figure[i][j] !== 0 && fieldClone[i + posX][j + posY] !== 0) {
        return false;
      }
    }
  }
  return true;
}

function refreshData() {
  document.getElementById("rec").innerHTML = recordGame;
  document.getElementById("rec1").innerHTML = recordGame;
  document.getElementById("numElem").innerHTML = numElem;
  document.getElementById("speed").innerHTML = speedGame;
}
