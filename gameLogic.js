/**
 * Created by Wenzhao on 2/17/15.
 */


'use strict';

angular.module('myApp', []).factory('gameLogic', function() {

    /** Returns the initial game board, 'F' represents foxes, 'S' represents sheep,
    * and 'X' represents the vertices that are invisible in the real game*/
    function getInitialBoard() {
        return [['X','X','F', '', 'F','X','X'],
            ['X','X','', '', '','X','X'],
            ['','','','','','',''],
            ['S','S','S','S','S','S','S'],
            ['S','S','S','S','S','S','S'],
            ['X','X','S','S','S','X','X'],
            ['X','X','S','S','S','X','X']];
    }

    /** Returns the winner, either 'F' or 's', or '' if there is no winner yet. There is no tie in this game.*/
    function getWinner(board) {
        var count,i,j;
        // check the top 3*3 matrix first, if the count of sheep is nine, then the winner is sheep
        for (i = 0; i < 3; i++) {
            for (j = 2; j < 5; j++) {
                if (board[i][j] === 'S') {
                    count++;
                }
            }
        }
        if (count === 9) return 'S';
        // check all the vertices, if the count of sheep is nine or above, then there is no winner yet
        count = 0;
        for (i = 0; i < 7; i++) {
            for (j = 0; j < 7; j++) {
                if (board[i][j] === 'S') {
                    count++;
                    if (count > 8) return '';
                }
            }
        }
        // if the count of sheep is below nine, foxes win
        return 'F';
    }

    function getPossibleMoves(board,turnIndexBeforeMove) {
        var possibleMoves = [];
        // if it's foxes' turn
        if (turnIndexBeforeMove === 0) {
            var i, j, count = 0;
            var rightCol, rightRow;
            var row, col;
            // scan the whole board to find the two foxes
            for (row = 0; row < 7; row++) {
                if (count == 2) break;
                for (col = 0; col < 7; col++) {
                    if (count == 2) break;
                    if (board[row][col] !== 'F') continue;
                    count++;
                    //check all the eight possible directions
                    for (i = -1; i < 2; i++) {
                        for (j = -1; j < 2; j++) {
                            if (i === 0 && j === 0) continue;  //no need to check itself
                            if ((col + row) % 2 !== 0 && i !== 0 && j !== 0) continue; //no such directions for this vertex
                            rightCol = col + 2 * i;
                            rightRow = row + 2 * j;
                            if (rightCol > -1 && rightCol < 7 && rightRow > -1 && rightRow < 7 && board[rightRow][rightCol] === '' && board[(rightRow + row) / 2][(rightCol + col) / 2] === 'S') {
                                possibleMoves.push(createMove(board, row, col, rightRow, rightCol,turnIndexBeforeMove));
                                //there is jump possibility
                            }
                        }
                    }
                }
            }
            if (possibleMoves.length !== 0) return possibleMoves; //if there is jump possibility, the foxes must jump
            else {
                count = 0;
                for (row = 0; row < 7; row++) {
                    if(count == 2) break;
                    for (col = 0; col < 7; col++) {
                        if (count == 2) break;
                        if (board[row][col] !== 'F') continue;
                        count++;
                        for (i = -1; i < 2; i = i + 1) {
                            for (j = -1; j < 2; j = j + 1) {
                                if (i === 0 && j === 0) continue;
                                if ((col + row) % 2 !== 0 && i !== 0 && j !== 0) continue;
                                rightCol = col + i;  //only check adjacent vertices this time
                                rightRow = row + j;
                                if (rightCol > -1 && rightCol < 7 && rightRow > -1 && rightRow < 7 && board[rightRow][rightCol] == '') {
                                    possibleMoves.push(createMove(board, row, col, rightRow, rightCol,turnIndexBeforeMove));
                                }
                            }
                        }
                    }
                }
                return possibleMoves;
            }
        }
        else {  // if it's sheep's turn
            var i, j, row, col;
            // find all the sheep
            for (row = 0; row < 7; row++) {
                for (col = 0; col < 7; col++) {
                    if (board[row][col] !== 'S') continue;
                    if ((row + col) % 2 === 0) {  // if the position has the additional four diagonal directions, check the two forward ones only
                        if (row - 1 > -1 && col - 1 > -1 && board[row - 1][col - 1] === '') {
                            possibleMoves.push(createMove(board,row,col,row - 1,col - 1,turnIndexBeforeMove));
                        }
                        if (row - 1 > -1 && col + 1 < 7 && board[row - 1][col + 1] === '' ) {
                            possibleMoves.push(createMove(board,row,col,row - 1,col + 1,turnIndexBeforeMove));
                        }
                    }
                    // check the three directions that every vertex has, ignore the backward one
                    if (col - 1 > -1 && board[row][col - 1] === '') {
                        possibleMoves.push(createMove(board,row,col,row,col - 1,turnIndexBeforeMove));
                    }
                    if (col + 1 < 7 && board[row][col + 1] === '') {
                        possibleMoves.push(createMove(board,row,col,row,col + 1,turnIndexBeforeMove));
                    }
                    if (row - 1 > -1 && board[row - 1][col] === '') {
                        possibleMoves.push(createMove(board,row,col,row - 1,col,turnIndexBeforeMove));
                    }
                }
            }
            return possibleMoves;
        }
    }

    function createMove(board,rowBefore,colBefore,rowAfter,colAfter,turnIndexBeforeMove) {
        if (board === undefined) {
            //Initially, the board state is undefined
            board = getInitialBoard();
        }
        if (getWinner(board) !== '' ) {
            throw new Error("Can only make a move if the game is not over!");
        }
        var boardAfterMove;
        // if it's foxes' turn
        if (turnIndexBeforeMove === 0) {
            boardAfterMove = createMoveFox(board,rowBefore,colBefore,rowAfter,colAfter);
        }
        else { //if it's sheep's turn
            boardAfterMove = createMoveSheep(board,rowBefore,colBefore,rowAfter,colAfter);
        }
        var winner = getWinner(boardAfterMove);
        var firstOperation;
        if (winner !== '') {
            // Game over.
            firstOperation = {endMatch: {endMatchScores:
                (winner === 'F' ? [1,0] : [0,1])}};
        }
        else {
            // Game continues. Now it's the opponent's turn (the turn switches from 0 to 1 and 1 to 0).
            firstOperation = {setTurn: {turnIndex: 1 - turnIndexBeforeMove}};
        }
        return [firstOperation,
            {set: {key: 'board', value: boardAfterMove}},
            {set: {key: 'delta', value: {rowBefore: rowBefore,colBefore: colBefore,rowAfter:rowAfter, colAfter: colAfter }}}];
    }

    function createMoveFox(board,rowBefore,colBefore,rowAfter,colAfter) {
        if (board[rowBefore][colBefore] !== 'F') {
            throw new Error("Please move a fox");
        }
        if (board[rowAfter][colAfter] !== '') {
            throw new Error("The vertex is occupied");
        }
        // First check whether the jump possibility exists, and if it does, whether the move is indeed jump
        var doesJumpExist = false;
        var isRightMove = false;
        var i,j;
        var rightCol, rightRow;
        //check all directions
        for (i = -1; i < 2; i = i + 1) {
            for (j = -1; j < 2; j = j + 1) {
                if (i === 0 && j === 0) continue; //no need to check itself
                if ((colBefore + rowBefore) % 2 !== 0 && i !== 0 && j !== 0) continue; //no such directions for this vertex
                rightCol = colBefore + 2 * i;
                rightRow = rowBefore + 2 * j;
                if (rightCol > -1 && rightCol < 7 && rightRow > -1 && rightRow < 7 && board[rightRow][rightCol] === '' && board[(rightRow + rowBefore) / 2][(rightCol + colBefore) / 2] === 'S') {
                    doesJumpExist = true; //jump possibility exists
                    if (rowAfter === rightRow && colAfter === rightCol) {
                        isRightMove = true; //the move is indeed jump
                    }
                }
            }
        }
        /** no matter how many jump possibilities exist, as long as the move is one of them,
         * both boolean variables will be true. Otherwise, if only one is true, there is error*/
        if (doesJumpExist === true && isRightMove === false) {
            throw new Error("Fox must jump over sheep if possible");
        }
        else if (doesJumpExist === false) {  //no jump possibility exists
            if ((colBefore + rowBefore) % 2 === 0 && (Math.abs(rowAfter - rowBefore) !== 1 || Math.abs(colAfter - colBefore) !== 1) && Math.abs(rowAfter - rowBefore) + Math.abs(colAfter - colBefore) !== 1) {
                // the position has a maximum of eight directions, however the move is not one of them
                throw new Error("Fox must move to adjacent vertices");
            }
            if ((colBefore + rowBefore) % 2 !== 0 && Math.abs(rowAfter - rowBefore) + Math.abs(colAfter - colBefore) !== 1) {
                // the position has a maximum of four directions, however the move is not one of them
                throw new Error("Fox must move to adjacent vertices");
            }
       }
        var boardAfterMove = angular.copy(board);
        boardAfterMove[rowAfter][colAfter] = 'F';
        if (doesJumpExist === true && isRightMove === true) {
            //the sheep will disappear if it is jumped over by fox
            board[(rightRow + rowBefore) / 2][(rightCol + colBefore) / 2] = '';
        }
        return boardAfterMove;
    }

    function createMoveSheep(board,rowBefore,colBefore,rowAfter,colAfter) {
        if (board[rowBefore][colBefore] !== 'S') {
            throw new Error("Please move a sheep");
        }
        if (board[rowAfter][colAfter] !== '') {
            throw new Error("The vertex is occupied");
        }
        if (((rowAfter !== rowBefore) && (rowAfter !== rowBefore - 1)) || Math.abs(colAfter - colBefore) > 1 ) {
            throw new Error("Sheep must move to adjacent vertices and cannot back up");
        }
        var boardAfterMove = angular.copy(board);
        boardAfterMove[rowAfter][colAfter] = 'S';
        return boardAfterMove;


    }

    function isMoveOk(params) {
        var move = params.move;
        var turnIndexBeforeMove = params.turnIndexBeforeMove;
        var stateBeforeMove = params.stateBeforeMove;
        try {
            var deltaValue = move[2].set.value;
            var rowBefore = deltaValue.rowBefore;
            var colBefore = deltaValue.colBefore;
            var rowAfter = deltaValue.rowAfter;
            var colAfter = deltaValue.colAfter;
            var board = stateBeforeMove.board;
            var expectedMove = createMove(board, rowBefore, colBefore,rowAfter,colAfter, turnIndexBeforeMove);
            if (!angular.equals(move, expectedMove)) {
                return false;
            }
        }catch (e) {
                return false;
            }
            return true;
        }

    return {
        getInitialBoard: getInitialBoard,
        getPossibleMoves: getPossibleMoves,
        createMove: createMove,
        isMoveOk: isMoveOk
    };

    });


