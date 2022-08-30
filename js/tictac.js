'use strict'
//-------Global Vars---------
let cols = 3;
let rows = 3;
let winningCount = 3;
const beginningPlayer = "X";

let maxClicks = cols * rows;
let clicksMade = 0;
let whichPlayersTurn = "";
let board;
let cells = new Array(rows);

//wait until the DOM bas been loaded
document.addEventListener('DOMContentLoaded', initGame);

//prepare game after the page has been loaded
function initGame() {
    board = document.getElementById("board");
    let restartButton = document.getElementById("restartButton");
    let startButton = document.getElementById("startButton");
    restartButton.addEventListener('click', restartGame);
    startButton.addEventListener('click', readGameSettings);
    window.addEventListener("resize", resizeBoardListener);
    resizeBoardListener();
}

//setup board and start game
function startGame() {
    resizeBoardListener();
    wipeBoard();
    clicksMade = 0;
    whichPlayersTurn = beginningPlayer;
    board.classList.add((whichPlayersTurn == "X") ? "O" : "X");
    board.style.gridTemplateColumns = "repeat(" + cols + ",auto)";
    cells = [];
    for (let i = 0; i < rows; i++) {
        cells[i] = new Array(cols);
        for (let j = 0; j < cols; j++) {
            let cellId = cols * i + j;
            cells[i][j] = cellId;
            const div = document.createElement("div");
            div.classList.add("cell");
            div.classList.toggle("firstRow", (i == 0) ? true : false);
            div.classList.toggle("firstCol", (j == 0) ? true : false);
            div.classList.toggle("lastRow", (i == rows - 1) ? true : false);
            div.classList.toggle("lastCol", (j == cols - 1) ? true : false);
            div.id = cellId;
            div.addEventListener("click", cellClicked, { once: true });
            board.appendChild(div);
        }
    }
}

//read validate and apply game settings 
function readGameSettings() {
    let setRows = document.getElementById("rows").value;
    let setCols = document.getElementById("cols").value;
    winningCount = document.getElementById("wins").value;
    setRows = (setRows < 3 || setRows > 10) ? 3 : +setRows;
    setCols = (setCols < 3 || setCols > 10) ? 3 : +setCols;
    document.getElementById("rows").value = setRows;
    document.getElementById("cols").value = setCols;
    if (winningCount <= setCols || winningCount <= setRows) {
        rows = setRows;
        cols = setCols;
        maxClicks = cols * rows;
        document.getElementById("configureGame").classList.add("hide");
        startGame();
    }
    winningCount = (winningCount > setCols && winningCount > setRows) ? (setCols > setRows ? setRows : setCols) : winningCount;
    document.getElementById("wins").value = winningCount;
}

//remove html cells and event listeners
function wipeBoard() {
    while (board.hasChildNodes()) {
        board.firstChild.removeEventListener("click", cellClicked, { once: true });
        board.removeChild(board.firstChild);
    }
    board.classList.remove(beginningPlayer);
}

//event listener resize board
function resizeBoardListener(e) {
    var availBoardSize = (board.clientHeight > board.clientWidth) ? board.clientWidth : board.clientHeight;
    var cellsPerDimension = (rows > cols) ? rows : cols;
    var cellSize = ~~(availBoardSize / cellsPerDimension);
    var root = document.querySelector(":root");
    root.style.setProperty("--cell-size", cellSize + "px");
    root.style.setProperty("--font-size", ~~(availBoardSize / 3) + "px");
}

//event listener 
function cellClicked(e) {
    var cellId = e.target.id;
    var cellCol = cellId % cols;
    var cellRow = ~~(cellId / cols);
    performMove(cellRow, cellCol);
}

//execute move - check end - toggle 
function performMove(cellRow, cellCol) {
    clicksMade++;
    var cellId = +(cols * cellRow + cellCol);
    var cell = document.getElementById(cellId);
    cell.innerText = whichPlayersTurn;
    cell.classList.add(whichPlayersTurn);
    cells[cellRow][cellCol] = whichPlayersTurn;
    let noDraw = checkWinner(cellRow, cellCol);
    if (noDraw || clicksMade == maxClicks) {
        gameOver(noDraw, whichPlayersTurn);
    }
    whichPlayersTurn = (whichPlayersTurn == "O") ? "X" : "O";
    board.classList.toggle("X");
    board.classList.toggle("O");
    //display the board on the console
    console.clear();
    logMoves(); 
}

/*
 * function that checks if the last turn led to the win of the game
 * rather than checking each row / column / diagonal for matches,
 * just the paths leading to or from the last move are checked.
 * @param r, c [row, column]: the last move
 * @returns [boolian]: true if its a win, false otherwise
 */
function checkWinner(r, c) {
    var checkRow = r;
    var checkCol = c;
    if (checkHoriVert(checkRow, checkCol)) {
        return true;
    }

    /* kept as a comment to make the lines below easier to read
    if (c > r) {
        checkCol = c - r;
        checkRow = 0;
    } else {
        checkCol = 0;
        checkRow = r - c;
    }
    if (checkDiagCw(checkRow, checkCol, maxRow)) {
        return true;
    }*/
    var minRow = 0;
    var maxRow = rows;
    var checkCol = (c > r) ? c - r : 0;
    var checkRow = (c > r) ? 0 : r - c;
    if (checkDiagCw(checkRow, checkCol, maxRow)) {
        return true;
    }

    /* kept as a comment to make the lines below easier to read
    var cmpRow = rows - 1 - r; 
    if (c <= cmpRow) {
        checkCol = 0;
        checkRow = r + c;
    } else {
        checkCol = c - cmpRow;
        checkRow = rows - 1;
    }
    return checkDiagCcw(checkRow, checkCol, minRow);*/
    var cmpRow = rows - 1 - r;
    var checkCol = (c <= cmpRow) ? 0 : c - cmpRow;
    var checkRow = (c <= cmpRow) ? r + c : rows - 1;
    return checkDiagCcw(checkRow, checkCol, minRow);
}

//check diagonal ccw
function checkDiagCcw(checkRow, checkCol, minRow) {
    var result = 0;
    for (let i = checkRow; i >= minRow; i--) {
        result += (whichPlayersTurn == cells[i][checkCol]) ? 1 : 0;
        result *= (whichPlayersTurn == cells[i][checkCol]) ? 1 : 0;
        if (result == winningCount) {
            return true;
        }
        checkCol++;
        if (checkCol == cols) {
            return false;
        }
    }
    return false;
}

//check diagonal cw
function checkDiagCw(checkRow, checkCol, maxRow) {
    var result = 0;
    for (let i = checkRow; i < maxRow; i++) {
        result += (whichPlayersTurn == cells[i][checkCol]) ? 1 : 0;
        result *= (whichPlayersTurn == cells[i][checkCol]) ? 1 : 0;
        if (result == winningCount) {
            return true;
        }
        checkCol++;
        if (checkCol == cols) {
            return false;
        }
    }
    return false;
}

//check rows + columns
function checkHoriVert(checkRow, checkCol) {
    var result = 0;
    for (let i = 0; i < cols; i++) {
        result += (whichPlayersTurn == cells[checkRow][i]) ? 1 : 0;
        result *= (whichPlayersTurn == cells[checkRow][i]) ? 1 : 0;
        if (result == winningCount) {
            return true;
        }
    }
    var result = 0;
    for (let i = 0; i < rows; i++) {
        result += (whichPlayersTurn == cells[i][checkCol]) ? 1 : 0;
        result *= (whichPlayersTurn == cells[i][checkCol]) ? 1 : 0;
        if (result == winningCount) {
            return true;
        }
    }
    return false;
}

//show game over and restart message
//@param:  gameResult [boolian]: true if a winner was found, false otherwise
//         player ["X" | "O"]:   the player that took the last move 
function gameOver(gameResult, player) {
    var gameOverMsg = document.querySelector('[data-winner-text]');
    gameOverMsg.innerText = (gameResult) ? player + "'s Wins!" : "Let's call it a Draw!";
    document.getElementById("gameOver").classList.add("show");
}

//show configure and start game form
function restartGame() {
    document.getElementById("gameOver").classList.remove("show");
    document.getElementById("configureGame").classList.remove("hide");
}


//---- for debugging and testing ----

//prints out the current game state on the console
function logMoves() {
    console.log(".");
    let fmt = cells.length * cells[0].length > 9 ? " " : "";
    for (let i = 0; i < cells.length; i++) {
        let xx = "";
        let x = "";
        let c = cells[i].length;
        for (let j = 0; j < c; j++) {
            x = cells[i][j];
            x = (isNaN(x) || x < 10) ? fmt + x : x;
            xx += x + ((j < c - 1) ? " | " : "");
        }
        console.log(xx);
    }
}

//---- some functions for future use - does not contribute to the game's function ----
//import { getNumericItemsFromArray, coordsFromAllCellsIndexes } from "./future-use.js";
//import { coordsFromAvailCellsIndexes, indexesFromAllCellsCoords, indexesFromAvailCellsCoords } from "./future-use.js";