/**
 * Created by Wenzhao on 2/17/15.
 */


'use strict';

angular.module('myApp', ['ngTouch', 'ui.bootstrap', 'gameServices']).factory('gameLogic', function() {


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
        var count = 0,i,j;
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
        //var i, j, l, k;
        // if it's foxes' turn
        if (turnIndexBeforeMove === 1) {
            for (var i = 0; i < 7; i++) {
                for (var j = 0; j < 7; j++) {
                    if (board[i][j] !== 'F') continue;
                    for (var l = 0; l < 7 ; l++) {
                        for (var k = 0; k < 7; k++) {
                            try {
                                possibleMoves.push(createMove(board, i, j, l, k, turnIndexBeforeMove));
                            } catch(e) {}
                        }
                    }
                }
            }
        }
        else {  // if it's sheep's turn
            for (var i = 0; i < 7; i++) {
                for (var j = 0; j < 7; j++) {
                    if (board[i][j] !== 'S') continue;
                    for (var l = 0; l < 7 ; l++) {
                        for (var k = 0; k < 7; k++) {
                            try {
                                possibleMoves.push(createMove(board, i, j, l, k, turnIndexBeforeMove));
                            } catch (e) {}
                        }
                    }
                }
            }
        }
        return possibleMoves;
    }


    function createMove(board,rowBefore,colBefore,rowAfter,colAfter,turnIndexBeforeMove) {
        if (board === undefined) {
            //Initially, the board state is undefined
            board = getInitialBoard();
        }
        if (getWinner(board) !== '' ) {
            throw new Error("Can only make a move if the game is not over!");
        }
        var boardAfterMove, isJump = false;
        // if it's foxes' turn
        if (turnIndexBeforeMove === 1) {
            var foxMove = createMoveFox(board,rowBefore,colBefore,rowAfter,colAfter);
            boardAfterMove = foxMove.boardAfterMove;
            isJump = foxMove.isJump;
        }
        else { //if it's sheep's turn
            boardAfterMove = createMoveSheep(board,rowBefore,colBefore,rowAfter,colAfter);
        }
        var winner = getWinner(boardAfterMove);
        var firstOperation;
        if (winner !== '') {
            // Game over.
            firstOperation = {endMatch: {endMatchScores:
                (winner === 'F' ? [0,1] : [1,0])}};
        }
        else {
            // Game continues
            //var items = getPossibleMoves(boardAfterMove, 1 - turnIndexBeforeMove);
            if (turnIndexBeforeMove === 1 && isJump && hasJumpPossibility(boardAfterMove,rowAfter,colAfter))
                firstOperation = {setTurn: {turnIndex: turnIndexBeforeMove}};    //still fox's turn
            /*else if (getPossibleMoves(boardAfterMove, 1 - turnIndexBeforeMove).length === 0 && getPossibleMoves(boardAfterMove, turnIndexBeforeMove).length === 0) {
             console.log("ie tie");
             firstOperation = {endMatch: {endMatchScores:
             ([0,0])}};  // ie tie
             }*/
            /*else if (items.length === 0) {
             console.log("ie not tie");
             firstOperation = {setTurn: {turnIndex: turnIndexBeforeMove}};
             }*/
            else if (turnIndexBeforeMove === 0 && !hasJumpPossibility(boardAfterMove,rowAfter,colAfter)) {
                var isThereMove = false;
                var rowFox1,colFox1,i, j;
                for (i = 0; i < 7; i++) {
                    for(j = 0; j < 7; j++) {
                        if (board[i][j] === 'F') { //find the first fox
                            rowFox1 = i;
                            colFox1 = j;
                            break;
                        }
                    }
                }
                for (i = -1; i < 2; i++) {
                    for (j = -1; j < 2; j++) {
                        if (rowFox1 + i > 6 || rowFox1 + i < 0 || colFox1 + j > 6 || colFox1 + j < 0) continue;
                        if ((rowFox1 + colFox1) % 2 !== 0 && Math.abs(i) + Math.abs(j) === 2) continue;
                        if (boardAfterMove[rowFox1 + i][colFox1 + j] === '') {
                            isThereMove = true;
                            break;
                        }
                    }
                }
                if (!isThereMove) {
                    var rowFox2, colFox2;
                    for (i = 0; i < 7; i++) {
                        for(j = 0; j < 7; j++) {
                            if (board[i][j] === 'F' && (i !== rowFox1 || j !== colFox1)) { //find the second fox
                                rowFox2 = i;
                                colFox2 = j;
                                break;
                            }
                        }
                    }
                    for (i = -1; i < 2; i++) {
                        for (j = -1; j < 2; j++) {
                            if (rowFox2 + i > 6 || rowFox2 + i < 0 || colFox2 + j > 6 || colFox2 + j < 0) continue;
                            if ((rowFox2 + colFox2) % 2 !== 0 && Math.abs(i) + Math.abs(j) === 2) continue;
                            if (boardAfterMove[rowFox2 + i][colFox2 + j] === '') {
                                isThereMove = true;
                                break;
                            }
                        }
                    }
                }
                //console.log(isThereMove);
                console.log("not tie yet");
                if (!isThereMove) {
                    firstOperation = {endMatch: {endMatchScores:
                        ([0,0])}};  // ie tie
                    console.log("is tie");
                    //firstOperation = {setTurn: {turnIndex: turnIndexBeforeMove}};
                }
                else firstOperation = {setTurn: {turnIndex: 1 - turnIndexBeforeMove}};
            }
            else {
                // Now it's the opponent's turn (the turn switches from 0 to 1 and 1 to 0).
                firstOperation = {setTurn: {turnIndex: 1 - turnIndexBeforeMove}};
            }
        }
        //var temp = [firstOperation,
          //  {set: {key: 'board', value: boardAfterMove}},
           // {set: {key: 'delta', value: {rowBefore: rowBefore,colBefore: colBefore,rowAfter:rowAfter, colAfter: colAfter}}}];
        //console.log("not tie yet" + temp[1].set.value.rowAfter);
        return [firstOperation,
            {set: {key: 'board', value: boardAfterMove}},
            {set: {key: 'delta', value: {rowBefore: rowBefore,colBefore: colBefore,rowAfter:rowAfter, colAfter: colAfter}}}];
    }

    function createMoveFox(board,rowBefore,colBefore,rowAfter,colAfter) {
        if (board[rowBefore][colBefore] !== 'F') {
            throw new Error("Please move a fox");
        }
        if (board[rowAfter][colAfter] === 'X') {
            throw new Error("Invalid move");
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
        for (i = -1; i < 2; i++) {
            for (j = -1; j < 2; j++) {
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
        if (doesJumpExist === true && isRightMove === false) {
            throw new Error("Fox must jump over sheep if possible");
        }
        else if (doesJumpExist === false) {  //no jump possibility exists for this fox, but have to check the other fox
            //find the second fox
            var rowFox2,colFox2;
            var doesJumpExist2 = false;
            for (i = 0; i < 7; i++) {
                for(j = 0; j < 7; j++) {
                    if (board[i][j] === 'F' && (i !== rowBefore || j !== colBefore)) { //make sure it's a different fox
                        rowFox2 = i;
                        colFox2 = j;
                        break;
                    }
                }
            }
            for (i = -1; i < 2; i++) {
                for (j = -1; j < 2; j++) {
                    if (i === 0 && j === 0) continue; //no need to check itself
                    if ((colFox2 + rowFox2) % 2 !== 0 && i !== 0 && j !== 0) continue; //no such directions for this vertex
                    rightCol = colFox2 + 2 * i;
                    rightRow = rowFox2 + 2 * j;
                    if (rightCol > -1 && rightCol < 7 && rightRow > -1 && rightRow < 7 && board[rightRow][rightCol] === '' && board[(rightRow + rowFox2) / 2][(rightCol + colFox2) / 2] === 'S') {
                        doesJumpExist2 = true; //jump possibility exists
                    }
                }
            }
            if (doesJumpExist2 === true) {  //the second fox has jump possibility
                throw new Error("Should move the fox with jump possibility");
            }
            // when neither two foxes have jump possibility
            if ((colBefore + rowBefore) % 2 === 0 && ((Math.abs(rowAfter - rowBefore) + Math.abs(colAfter - colBefore) > 2) || (Math.abs(rowAfter - rowBefore) === 2 || Math.abs(colAfter - colBefore) === 2))) {
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
        boardAfterMove[rowBefore][colBefore] = '';
        /*if (doesJumpExist === true && isRightMove === true) {
         //the sheep will disappear if it is jumped over by fox
         boardAfterMove[(rowAfter + rowBefore) / 2][(rowBefore + colBefore) / 2] = '';
         }*/
        if (Math.abs(rowAfter - rowBefore) == 2 || Math.abs(colAfter - colBefore) == 2) {
            boardAfterMove[(rowAfter + rowBefore) / 2][(colAfter + colBefore) / 2] = '';
        }
        return {boardAfterMove:boardAfterMove,
            isJump:isRightMove
        };
    }

    function createMoveSheep(board,rowBefore,colBefore,rowAfter,colAfter) {
        if (board[rowBefore][colBefore] !== 'S') {
            throw new Error("Please move a sheep");
        }
        if (board[rowAfter][colAfter] === 'X') {
            throw new Error("Invalid move");
        }
        if (board[rowAfter][colAfter] !== '') {
            throw new Error("The vertex is occupied");
        }
        if (((rowAfter !== rowBefore) && (rowAfter !== rowBefore - 1)) || Math.abs(colAfter - colBefore) > 1 ) {
            throw new Error("Sheep must move to adjacent vertices and cannot back up");
        }
        if (Math.abs(rowAfter - rowBefore) == 1 && Math.abs(colAfter - colBefore) == 1) {
            throw new Error("Sheep cannot move diagonally");
        }
        var boardAfterMove = angular.copy(board);
        boardAfterMove[rowAfter][colAfter] = 'S';
        boardAfterMove[rowBefore][colBefore] = '';
        return boardAfterMove;


    }

    function hasJumpPossibility(board,row,col) {
        var rowFox1,colFox1,i, j,rightCol,rightRow;
        var doesJumpExist = false;
        /*for (i = 0; i < 7; i++) {
            for(j = 0; j < 7; j++) {
                if (board[i][j] === 'F') { //find the first fox
                    rowFox1 = i;
                    colFox1 = j;
                    break;
                }
            }
        }*/
        rowFox1 = row;
        colFox1 = col;
        for (i = -1; i < 2; i++) {
            for (j = -1; j < 2; j++) {
                if (i === 0 && j === 0) continue; //no need to check itself
                if ((colFox1 + rowFox1) % 2 !== 0 && i !== 0 && j !== 0) continue; //no such directions for this vertex
                rightCol = colFox1 + 2 * i;
                rightRow = rowFox1 + 2 * j;
                if (rightCol > -1 && rightCol < 7 && rightRow > -1 && rightRow < 7 && board[rightRow][rightCol] === '' && board[(rightRow + rowFox1) / 2][(rightCol + colFox1) / 2] === 'S') {
                    doesJumpExist = true; //jump possibility exists
                }
            }
        }
        /*if(doesJumpExist === false) {
            var rowFox2,colFox2;
            for (i = 0; i < 7; i++) {
                for(j = 0; j < 7; j++) {
                    if (board[i][j] === 'F'&& (i !== rowFox1 || j !== colFox1)) { //find the second fox
                        rowFox2 = i;
                        colFox2 = j;
                        break;
                    }
                }
            }
            for (i = -1; i < 2; i++) {
                for (j = -1; j < 2; j++) {
                    if (i === 0 && j === 0) continue; //no need to check itself
                    if ((colFox2 + rowFox2) % 2 !== 0 && i !== 0 && j !== 0) continue; //no such directions for this vertex
                    rightCol = colFox2 + 2 * i;
                    rightRow = rowFox2 + 2 * j;
                    if (rightCol > -1 && rightCol < 7 && rightRow > -1 && rightRow < 7 && board[rightRow][rightCol] === '' && board[(rightRow + rowFox2) / 2][(rightCol + colFox2) / 2] === 'S') {
                        doesJumpExist = true; //jump possibility exists
                    }
                }
            }
        }*/
        //console.log(doesJumpExist);
        return doesJumpExist;
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
            /*if (!angular.equals(move, expectedMove)) {
             return false;
             }*/

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
