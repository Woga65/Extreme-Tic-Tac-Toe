//---- AI implementation / future use ----

export function aiFindBestMove() {
    return false;
}

export function minimax(depth, isMaximizer) {
    return false;
}


//---- somewhat generic array functions to deal with an array of arrays---

/*
 * function that creates a new array from all numeric items of an array
 * @param:   arr[]:   any
 * @returns: array[]: number
 */
export function getNumericItemsFromArray(arr) {
    return arr.filter(i => !isNaN(i)).map(x => +x);
}

/*
 * function that calculates coordinates from the indexes of all cells of a Tic-Tac-Toe board
 * @param:   board[cell index | X | O]: any
 *           cols: number of columns
 * @returns: array[coord row][coord col]: number
 * example:  board: [0, 1, 2, 3, "X", 5, 6, 7, 8] -> array: [0 ,0][0, 1][0, 2] [1, 0][1, 1][1, 2]  [2, 0][2, 1][2, 2]
 */
export function coordsFromAllCellsIndexes(board, cols) {
    return board.map((x, i) => [~~((isNaN(x) ? i : x) / cols), (isNaN(x) ? i : x) % cols]);
}

/*
 * function that calculates the coordinates from the indexes of all not yet played cells of a Tic-Tac-Toe board
 * @param:   board[cell index | X | O]: any
 *           cols: number of columns
 * @returns: array[coord row][coord col]: number
 * example:  board: [0, 1, 2, 3, "X", 5, 6, 7, 8] -> array: [0 ,0][0, 1][0, 2] [1, 0][1, 2]  [2, 0][2, 1][2, 2]
 */
export function coordsFromAvailCellsIndexes(board, cols) {
    return board.filter(i => !isNaN(i)).map(x => [~~(x / cols), x % cols]);
}

/*
 * function that creates a new array from an array of arrays
 * @param:   board[][]: any
 * @returns: array[]: any
 */
export function indexesFromAllCellsCoords(board) {
    return board.toString().replace(/"/g, "").split(",").map(x => isNaN(x) ? x : +x);
}

/*
 * function that creates a new array from all numeric items of an array of arrays
 * @param:   board[][]: any
 * @returns: array[]: number
 */
export function indexesFromAvailCellsCoords(board) {
    return board.toString().replace(/"/g, "").split(",").filter(x => !isNaN(x)).map(x => +x);
}

/*
function coordsFromIndexes(board, cols) {
    let result = [];
    for (let i = 0; i < board.length; i++) {
        let cellId = isNaN(board[i]) ? i : board[i];
        result.push([~~(cellId / cols), cellId % cols]);
    }
    return result;
}

function coordsFromEmptyIndexes(board, cols) {
    let result = [];
    for (let i = 0; i < board.length; i++) {
        if (!isNaN(board[i])) {
            result.push([~~(board[i] / cols), board[i] % cols]);
        }
    }
    return result;
}

function indexesFromCoords(board) {
    let result = [];
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            board[i][j] = isNaN(board[i][j]) ? board[i][j] : board[i].length * i + j; 
            result.push(board[i][j]);
        }
    }
    return result;
}

function indexesFromEmptyCoords(board) {
    let result = [];
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            if (!isNaN(board[i][j])) {
                result.push(board[i].length * i + j);
            }
        }
    }
    return result;
}
*/


//---- for debugging and testing ----
//import { cells, rows, cols } from "./tictac.js";