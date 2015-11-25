/**
 * Created by Wenzhao on 2/17/15.
 */
var gameLogic;
(function (gameLogic) {
    /** Returns the initial game board, 'F' represents foxes, 'S' represents sheep,
     * and 'X' represents the vertices that are invisible in the real game*/
    function getInitialBoard() {
        return [['X', 'X', 'F', '', 'F', 'X', 'X'],
            ['X', 'X', '', '', '', 'X', 'X'],
            ['', '', '', '', '', '', ''],
            ['S', 'S', 'S', 'S', 'S', 'S', 'S'],
            ['S', 'S', 'S', 'S', 'S', 'S', 'S'],
            ['X', 'X', 'S', 'S', 'S', 'X', 'X'],
            ['X', 'X', 'S', 'S', 'S', 'X', 'X']];
    }
    gameLogic.getInitialBoard = getInitialBoard;
    /** Returns the winner, either 'F' or 's', or '' if there is no winner yet. There is no tie in this game.*/
    function getWinner(board) {
        var count = 0;
        var i;
        var j;
        // check the top 3*3 matrix first, if the count of sheep is nine, then the winner is sheep
        for (i = 0; i < 3; i++) {
            for (j = 2; j < 5; j++) {
                if (board[i][j] === 'S') {
                    count++;
                }
            }
        }
        if (count === 9)
            return 'S';
        // check all the vertices, if the count of sheep is nine or above, then there is no winner yet
        count = 0;
        for (i = 0; i < 7; i++) {
            for (j = 0; j < 7; j++) {
                if (board[i][j] === 'S') {
                    count++;
                    if (count > 8)
                        return '';
                }
            }
        }
        // if the count of sheep is below nine, foxes win
        return 'F';
    }
    function getPossibleMoves(board, turnIndexBeforeMove) {
        var possibleMoves = [];
        if (turnIndexBeforeMove === 1) {
            for (var i = 0; i < 7; i++) {
                for (var j = 0; j < 7; j++) {
                    if (board[i][j] !== 'F')
                        continue;
                    for (var l = 0; l < 7; l++) {
                        for (var k = 0; k < 7; k++) {
                            try {
                                possibleMoves.push(createMove(board, i, j, l, k, turnIndexBeforeMove));
                            }
                            catch (e) { }
                        }
                    }
                }
            }
        }
        else {
            for (var i = 0; i < 7; i++) {
                for (var j = 0; j < 7; j++) {
                    if (board[i][j] !== 'S')
                        continue;
                    for (var l = 0; l < 7; l++) {
                        for (var k = 0; k < 7; k++) {
                            try {
                                possibleMoves.push(createMove(board, i, j, l, k, turnIndexBeforeMove));
                            }
                            catch (e) { }
                        }
                    }
                }
            }
        }
        return possibleMoves;
    }
    gameLogic.getPossibleMoves = getPossibleMoves;
    function createMove(board, rowBefore, colBefore, rowAfter, colAfter, turnIndexBeforeMove) {
        if (board === undefined) {
            //Initially, the board state is undefined
            board = getInitialBoard();
        }
        if (getWinner(board) !== '') {
            throw new Error("Can only make a move if the game is not over!");
        }
        var boardAfterMove;
        var isJump = false;
        // if it's foxes' turn
        if (turnIndexBeforeMove === 1) {
            var foxMove = createMoveFox(board, rowBefore, colBefore, rowAfter, colAfter);
            boardAfterMove = foxMove.boardAfterMove;
            isJump = foxMove.isJump;
        }
        else {
            boardAfterMove = createMoveSheep(board, rowBefore, colBefore, rowAfter, colAfter);
        }
        var winner = getWinner(boardAfterMove);
        var firstOperation;
        if (winner !== '') {
            // Game over.
            firstOperation = { endMatch: { endMatchScores: (winner === 'F' ? [0, 1] : [1, 0]) } };
        }
        else {
            // Game continues
            //var items = getPossibleMoves(boardAfterMove, 1 - turnIndexBeforeMove);
            if (turnIndexBeforeMove === 1 && isJump && hasJumpPossibility(boardAfterMove, rowAfter, colAfter))
                firstOperation = { setTurn: { turnIndex: turnIndexBeforeMove } }; //still fox's turn
            else if (turnIndexBeforeMove === 0 && !hasJumpPossibility(boardAfterMove, rowAfter, colAfter)) {
                var isThereMove = false;
                var rowFox1;
                var colFox1;
                var i;
                var j;
                for (i = 0; i < 7; i++) {
                    for (j = 0; j < 7; j++) {
                        if (board[i][j] === 'F') {
                            rowFox1 = i;
                            colFox1 = j;
                            break;
                        }
                    }
                }
                for (i = -1; i < 2; i++) {
                    for (j = -1; j < 2; j++) {
                        if (rowFox1 + i > 6 || rowFox1 + i < 0 || colFox1 + j > 6 || colFox1 + j < 0)
                            continue;
                        if ((rowFox1 + colFox1) % 2 !== 0 && Math.abs(i) + Math.abs(j) === 2)
                            continue;
                        if (boardAfterMove[rowFox1 + i][colFox1 + j] === '') {
                            isThereMove = true;
                            break;
                        }
                    }
                }
                if (!isThereMove) {
                    var rowFox2, colFox2;
                    for (i = 0; i < 7; i++) {
                        for (j = 0; j < 7; j++) {
                            if (board[i][j] === 'F' && (i !== rowFox1 || j !== colFox1)) {
                                rowFox2 = i;
                                colFox2 = j;
                                break;
                            }
                        }
                    }
                    for (i = -1; i < 2; i++) {
                        for (j = -1; j < 2; j++) {
                            if (rowFox2 + i > 6 || rowFox2 + i < 0 || colFox2 + j > 6 || colFox2 + j < 0)
                                continue;
                            if ((rowFox2 + colFox2) % 2 !== 0 && Math.abs(i) + Math.abs(j) === 2)
                                continue;
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
                    firstOperation = { endMatch: { endMatchScores: ([0, 0]) } }; // ie tie
                    console.log("is tie");
                }
                else
                    firstOperation = { setTurn: { turnIndex: 1 - turnIndexBeforeMove } };
            }
            else {
                // Now it's the opponent's turn (the turn switches from 0 to 1 and 1 to 0).
                firstOperation = { setTurn: { turnIndex: 1 - turnIndexBeforeMove } };
            }
        }
        //var temp = [firstOperation,
        //  {set: {key: 'board', value: boardAfterMove}},
        // {set: {key: 'delta', value: {rowBefore: rowBefore,colBefore: colBefore,rowAfter:rowAfter, colAfter: colAfter}}}];
        //console.log("not tie yet" + temp[1].set.value.rowAfter);
        return [firstOperation,
            { set: { key: 'board', value: boardAfterMove } },
            { set: { key: 'delta', value: { rowBefore: rowBefore, colBefore: colBefore, rowAfter: rowAfter, colAfter: colAfter } } }];
    }
    gameLogic.createMove = createMove;
    function createMoveFox(board, rowBefore, colBefore, rowAfter, colAfter) {
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
        var i;
        var j;
        var rightCol;
        var rightRow;
        //check all directions
        for (i = -1; i < 2; i++) {
            for (j = -1; j < 2; j++) {
                if (i === 0 && j === 0)
                    continue; //no need to check itself
                if ((colBefore + rowBefore) % 2 !== 0 && i !== 0 && j !== 0)
                    continue; //no such directions for this vertex
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
        else if (doesJumpExist === false) {
            //find the second fox
            var rowFox2;
            var colFox2;
            var doesJumpExist2 = false;
            for (i = 0; i < 7; i++) {
                for (j = 0; j < 7; j++) {
                    if (board[i][j] === 'F' && (i !== rowBefore || j !== colBefore)) {
                        rowFox2 = i;
                        colFox2 = j;
                        break;
                    }
                }
            }
            for (i = -1; i < 2; i++) {
                for (j = -1; j < 2; j++) {
                    if (i === 0 && j === 0)
                        continue; //no need to check itself
                    if ((colFox2 + rowFox2) % 2 !== 0 && i !== 0 && j !== 0)
                        continue; //no such directions for this vertex
                    rightCol = colFox2 + 2 * i;
                    rightRow = rowFox2 + 2 * j;
                    if (rightCol > -1 && rightCol < 7 && rightRow > -1 && rightRow < 7 && board[rightRow][rightCol] === '' && board[(rightRow + rowFox2) / 2][(rightCol + colFox2) / 2] === 'S') {
                        doesJumpExist2 = true; //jump possibility exists
                    }
                }
            }
            if (doesJumpExist2 === true) {
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
        return { boardAfterMove: boardAfterMove,
            isJump: isRightMove
        };
    }
    function createMoveSheep(board, rowBefore, colBefore, rowAfter, colAfter) {
        if (board[rowBefore][colBefore] !== 'S') {
            throw new Error("Please move a sheep");
        }
        if (board[rowAfter][colAfter] === 'X') {
            throw new Error("Invalid move");
        }
        if (board[rowAfter][colAfter] !== '') {
            throw new Error("The vertex is occupied");
        }
        if (((rowAfter !== rowBefore) && (rowAfter !== rowBefore - 1)) || Math.abs(colAfter - colBefore) > 1) {
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
    function hasJumpPossibility(board, row, col) {
        var rowFox1;
        var colFox1;
        var i;
        var j;
        var rightCol;
        var rightRow;
        var doesJumpExist = false;
        rowFox1 = row;
        colFox1 = col;
        for (i = -1; i < 2; i++) {
            for (j = -1; j < 2; j++) {
                if (i === 0 && j === 0)
                    continue; //no need to check itself
                if ((colFox1 + rowFox1) % 2 !== 0 && i !== 0 && j !== 0)
                    continue; //no such directions for this vertex
                rightCol = colFox1 + 2 * i;
                rightRow = rowFox1 + 2 * j;
                if (rightCol > -1 && rightCol < 7 && rightRow > -1 && rightRow < 7 && board[rightRow][rightCol] === '' && board[(rightRow + rowFox1) / 2][(rightCol + colFox1) / 2] === 'S') {
                    doesJumpExist = true; //jump possibility exists
                }
            }
        }
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
            var expectedMove = createMove(board, rowBefore, colBefore, rowAfter, colAfter, turnIndexBeforeMove);
        }
        catch (e) {
            return false;
        }
        return true;
    }
    gameLogic.isMoveOk = isMoveOk;
})(gameLogic || (gameLogic = {}));
angular.module('myApp', ['ngTouch', 'ui.bootstrap', 'gameServices']).factory('gameLogic', function () {
    return {
        getInitialBoard: gameLogic.getInitialBoard,
        getPossibleMoves: gameLogic.getPossibleMoves,
        createMove: gameLogic.createMove,
        isMoveOk: gameLogic.isMoveOk
    };
});
;/**
 * Created by Wenzhao on 4/3/15.
 */
var aiService;
(function (aiService) {
    var isContinue = false;
    var currentRow = 0;
    var currentCol = 0;
    function createComputerMove(board, playerIndex) {
        var possibleMoves = gameLogic.getPossibleMoves(board, playerIndex);
        if (playerIndex === 0) {
            if (possibleMoves.length !== 0) {
                var randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
                return randomMove;
            }
        }
        var move;
        try {
            if (isContinue) {
                for (var i = 0; i < possibleMoves.length; i++) {
                    if (possibleMoves[i][2].set.value.rowBefore !== currentRow || possibleMoves[i][2].set.value.colBefore !== currentCol) {
                        possibleMoves.splice(i, 1);
                    }
                }
            }
            if (possibleMoves.length === 1) {
                move = possibleMoves[0];
            }
            else if (isJump(possibleMoves[0])) {
                var max = 1;
                move = possibleMoves[0];
                for (var i = 0; i < possibleMoves.length; i++) {
                    var temp = 1 + jumpNumbers(possibleMoves[i]);
                    if (temp > max) {
                        max = temp;
                        move = possibleMoves[i];
                    }
                }
            }
            else {
                var max = 0;
                move = possibleMoves[0];
                for (var i = 0; i < possibleMoves.length; i++) {
                    var temp = jumpNumbers(possibleMoves[i]);
                    if (temp > max) {
                        max = temp;
                        move = possibleMoves[i];
                    }
                }
                if (max === 0) {
                    var maxSheep = 0; //find the move which will be close to the largest number of sheep
                    //move = possibleMoves[0];
                    for (var i = 0; i < possibleMoves.length; i++) {
                        var temp = sheepNumber(possibleMoves[i]);
                        if (temp > maxSheep) {
                            maxSheep = temp;
                            move = possibleMoves[i];
                        }
                    }
                    if (maxSheep === 0) {
                        if (possibleMoves[0][2].set.value.rowBefore < 3) {
                            for (var i = 0; i < possibleMoves.length; i++) {
                                if (possibleMoves[i][2].set.value.rowBefore < possibleMoves[i][2].set.value.rowAfter) {
                                    move = possibleMoves[i];
                                    break;
                                }
                            }
                        }
                        else {
                            for (var i = 0; i < possibleMoves.length; i++) {
                                if (possibleMoves[i][2].set.value.rowBefore > possibleMoves[i][2].set.value.rowAfter) {
                                    move = possibleMoves[i];
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        }
        catch (e) {
            move = possibleMoves[0];
        }
        //console.log("isJump" + isJump(move));
        if (!isJump(move)) {
            isContinue = false;
        }
        else {
            var tempMoves = gameLogic.getPossibleMoves(move[1].set.value, 1);
            var i;
            for (i = 0; i < tempMoves.length; i++) {
                if (isJump(tempMoves[i]) && tempMoves[i][2].set.value.rowBefore === move[2].set.value.rowAfter && tempMoves[i][2].set.value.colBefore === move[2].set.value.colAfter) {
                    isContinue = true;
                    currentRow = move[2].set.value.rowAfter;
                    currentCol = move[2].set.value.colAfter;
                    break;
                }
            }
            console.log("i is " + i);
            if (i === tempMoves.length) {
                isContinue = false;
            }
        }
        return move;
    }
    aiService.createComputerMove = createComputerMove;
    function jumpNumbers(move) {
        var possibleMoves = gameLogic.getPossibleMoves(move[1].set.value, 1);
        for (var i = 0; i < possibleMoves.length; i++) {
            if (possibleMoves[i][2].set.value.rowBefore !== move[2].set.value.rowAfter || possibleMoves[i][2].set.value.colBefore !== move[2].set.value.colAfter) {
                possibleMoves.splice(i, 1);
            }
        }
        if (possibleMoves.length === 0)
            return 0;
        if (!isJump(possibleMoves[0]))
            return 0;
        if (possibleMoves.length === 1 && isJump(possibleMoves[0]))
            return 1;
        var max = 0;
        var move = possibleMoves[0];
        for (var i = 0; i < possibleMoves.length; i++) {
            var temp = jumpNumbers(possibleMoves[i]);
            if (temp > max) {
                max = temp;
                move = possibleMoves[i];
            }
        }
        return 1 + max;
    }
    function isJump(move) {
        var rowBefore = move[2].set.value.rowBefore;
        var rowAfter = move[2].set.value.rowAfter;
        var colBefore = move[2].set.value.colBefore;
        var colAfter = move[2].set.value.colAfter;
        if (Math.abs(rowBefore - rowAfter) === 2 || Math.abs(colBefore - colAfter) === 2)
            return true;
        else
            return false;
    }
    function sheepNumber(move) {
        var row = move[2].set.value.rowAfter;
        var col = move[2].set.value.colAfter;
        var board = move[1].set.value;
        //console.log("board:", board);
        var count = 0;
        //console.log("board:", board[row + i][col + j]);
        for (var i = -1; i < 2; i++) {
            for (var j = -1; j < 2; j++) {
                //console.log("board:", board[row + i][col + j]);
                if (i === 0 && j === 0)
                    continue;
                if (row + i < 0 || row + i > 6 || col + j < 0 || col + j > 6)
                    continue;
                if (board[row + i][col + j] === 'S') {
                    count++;
                    console.log("count: ", row + i, col + j);
                }
            }
        }
        return count;
    }
})(aiService || (aiService = {}));
angular.module('myApp').factory('aiService', function () {
    return { createComputerMove: aiService.createComputerMove };
});
;/**
 * Created by Wenzhao on 3/4/15.
 */
var game;
(function (game) {
    var animationEnded = false;
    var randomMove;
    var justHasRandomMove = false;
    var computerMove = false;
    var isFirstClick = true;
    var isSecondClick = 0; // 0: no value, 1: is first click, 2: is second click
    var firstClickRow;
    var firstClickCol;
    var secondClickRow;
    var secondClickCol;
    var state = null;
    // let board: Board;
    // let delta: IDelta;
    var turnIndex;
    var isYourTurn;
    var uiState = [];
    var gameArea;
    var nextZIndex = 61;
    var rowsNum = 7;
    var colsNum = 7;
    var draggingStartedRowCol = { row: -1, col: -1 };
    var draggingPiece = null;
    var justInitialize = false;
    function init() {
        resizeGameAreaService.setWidthToHeight(0.666666667);
        gameService.setGame({
            // gameDeveloperEmail: "bzsmz1990@gmail.com",
            minNumberOfPlayers: 2,
            maxNumberOfPlayers: 2,
            isMoveOk: gameLogic.isMoveOk,
            updateUI: updateUI
        });
        // See http://www.sitepoint.com/css3-animation-javascript-event-handlers/
        document.addEventListener("animationend", animationEndedCallback, false); // standard
        document.addEventListener("webkitAnimationEnd", animationEndedCallback, false); // WebKit
        document.addEventListener("oanimationend", animationEndedCallback, false); // Opera
        dragAndDropService.addDragListener("gameArea", handleDragEvent);
    }
    game.init = init;
    function animationEndedCallback() {
        $rootScope.$apply(function () {
            log.info("Animation ended");
            animationEnded = true;
            if (computerMove) {
                sendComputerMove();
            }
        });
    }
    function sendComputerMove() {
        var move = createComputerMove(state.board, turnIndex);
        gameService.makeMove(move);
    }
    function updateUI(params) {
        state = params.stateAfterMove;
        // var board = params.stateAfterMove.board;
        // var delta = params.stateAfterMove.delta;
        var notFirstTime = true;
        if (state.board === undefined) {
            state.board = gameLogic.getInitialBoard();
            notFirstTime = false;
            initializeUiState();
        }
        isYourTurn = params.turnIndexAfterMove >= 0 &&
            params.yourPlayerIndex === params.turnIndexAfterMove; // it's my turn
        turnIndex = params.turnIndexAfterMove;
        if (notFirstTime) {
            updateUiState();
        }
        // Is it the computer's turn?
        // if (isYourTurn &&
        //   params.playersInfo[params.yourPlayerIndex].playerId === '') {
        //   isYourTurn = false; // to make sure the UI won't send another move.
        //   // Waiting 0.5 seconds to let the move animation finish; if we call aiService
        //   // then the animation is paused until the javascript finishes.
        //   computerMove = true;
        //   console.log(computerMove);
        //   $timeout(sendComputerMove, 1200);
        //   $timeout(changeBoolean, 1000);
        //   console.log(computerMove);
        // }
        computerMove = isYourTurn && params.playersInfo[params.yourPlayerIndex].playerId === '';
        if (computerMove) {
            isYourTurn = false;
            if (!state.delta) {
                console.log(computerMove);
                $timeout(sendComputerMove, 1200);
                $timeout(changeBoolean, 1000);
                console.log(computerMove);
            }
        }
    }
    function changeBoolean() {
        computerMove = false;
    }
    function initializeUiState() {
        // Initialize the ui state as an array first
        uiState = [];
        var defaultUISquare = {
            content: -1,
            isSelected: false //,
        };
        var row;
        var col;
        var board_help = gameLogic.getInitialBoard();
        for (row = 0; row < 7; row++) {
            for (col = 0; col < 7; col++) {
                if (col === 0)
                    uiState.push([]);
                if (board_help[row][col] === 'F') {
                    var foxUISquare = angular.copy(defaultUISquare);
                    foxUISquare.content = 1;
                    //foxUISquare.pieceSrc = 'img/fox';
                    uiState[row][col] = foxUISquare;
                }
                else if (board_help[row][col] === 'S') {
                    var sheepUISquare = angular.copy(defaultUISquare);
                    sheepUISquare.content = 0;
                    //sheepUISquare.pieceSrc = 'img/sheep';
                    uiState[row][col] = sheepUISquare;
                }
                else
                    uiState[row][col] = defaultUISquare;
            }
        }
        justInitialize = true;
    }
    function updateUiState() {
        for (var i = 0; i < 7; i++) {
            for (var j = 0; j < 7; j++) {
                var char = state.board[i][j];
                var uiSquare = uiState[i][j];
                var uISquareCopy = {
                    content: char === 'S' ? 0 : (char === 'F' ? 1 : -1),
                    isSelected: isSecondClick === 1 ? uiSquare.isSelected : false //,
                };
                //document.getElementById('e2e_test_img_' + i + 'x' + j).className = 'enlarge1';
                uiState[i][j] = uISquareCopy;
            }
        }
        justInitialize = false;
        isSecondClick = 0;
        console.log(justHasRandomMove);
        //animation
        var row = state.delta.rowAfter;
        var col = state.delta.colAfter;
        var img = document.getElementById('e2e_test_img_' + row + 'x' + col);
        if (img.className === 'enlarge1')
            img.className = 'enlarge2';
        else
            img.className = 'enlarge1';
        console.log("current" + img.className);
        var rowBefore = state.delta.rowBefore;
        var colBefore = state.delta.colBefore;
        for (var i = 0; i < 7; i++) {
            for (var j = 0; j < 7; j++) {
                console.log(uiState[i][j].content);
            }
        }
        console.log("turnIndex " + turnIndex);
        console.log("current" + img.className);
    }
    function getSquare(row, col) {
        return uiState[row][col];
    }
    game.getSquare = getSquare;
    ;
    //drag and drop
    function handleDragEvent(type, clientX, clientY) {
        gameArea = document.getElementById("gameArea");
        console.log("clientWidth" + gameArea.clientWidth);
        console.log("clientHeight" + gameArea.clientHeight);
        console.log(computerMove);
        if (computerMove === true)
            return;
        // Center point in gameArea
        var x = clientX - gameArea.offsetLeft;
        var y = clientY - gameArea.offsetTop;
        var row, col;
        // Is outside gameArea?
        if (x < 0 || y < 0 || x >= gameArea.clientWidth || y >= gameArea.clientHeight) {
            //draggingLines.style.display = "none";
            if (draggingPiece) {
                // Drag the piece where the touch is (without snapping to a square).
                var size = getSquareWidthHeight();
                setDraggingPieceTopLeft({
                    top: y - size.height / 2,
                    left: x - size.width / 2
                });
            }
            else {
                return;
            }
        }
        else {
            // Inside gameArea. Let's find the containing square's row and col
            var col = Math.floor(colsNum * x / gameArea.clientWidth);
            //if (y < 0.05 * gameArea.clientHeight  || y > 0.95 * gameArea.clientHeight ) return;
            var row = Math.floor(rowsNum * (y - 0.12 * gameArea.clientHeight) / gameArea.clientHeight / 0.75);
            //if ($scope.turnIndex == 1) row = row - 1;
            if (type === "touchstart" && draggingStartedRowCol.row < 0 && draggingStartedRowCol.col < 0) {
                // drag started
                console.log("turnIndex " + turnIndex);
                if (state.board[row][col] != '' || state.board[row][col] != 'X') {
                    draggingStartedRowCol = {
                        row: row,
                        col: col
                    };
                    console.log("firstrow" + draggingStartedRowCol.row);
                    draggingPiece = document.getElementById('e2e_test_img_' + row + 'x' + col);
                    console.log("draggingPiece" + draggingPiece);
                    draggingPiece.style['z-index'] = ++nextZIndex;
                    console.log("style" + draggingPiece.style['z-index']);
                }
            }
            if (!draggingPiece) {
                return;
            }
            //$log.info(type);
            if (type === "touchend") {
                //$log.info("turnIndex " + $scope.turnIndex);
                var from = draggingStartedRowCol;
                var to = {
                    row: row,
                    col: col
                };
                if (turnIndex === 0) {
                    if (from.row > to.row)
                        to.row = from.row - 1;
                    if (from.col < to.col)
                        to.col = from.col + 1;
                    if (from.col > to.col)
                        to.col = from.col - 1;
                }
                else {
                    if (to.row === from.row && to.col < from.col) {
                        if (state.board[to.row][from.col - 1] === 'S')
                            to.col = from.col - 2;
                        else
                            to.col = from.col - 1;
                    }
                    if (to.row === from.row && to.col > from.col) {
                        if (state.board[to.row][from.col + 1] === 'S')
                            to.col = from.col + 2;
                        else
                            to.col = from.col + 1;
                    }
                    if (to.col === from.col && to.row < from.row) {
                        if (state.board[from.row - 1][from.col] === 'S')
                            to.row = from.row - 2;
                        else
                            to.row = from.row - 1;
                    }
                    if (to.col === from.col && to.row > from.row) {
                        if (state.board[from.row + 1][from.col] === 'S')
                            to.row = from.row + 2;
                        else
                            to.row = from.row + 1;
                    }
                    if (to.row < from.row && to.col < from.col && Math.abs(to.row - from.row) === Math.abs(to.col - from.col)) {
                        if (state.board[from.row - 1][from.col - 1] === 'S') {
                            to.row = from.row - 2;
                            to.col = from.col - 2;
                        }
                        else {
                            to.row = from.row - 1;
                            to.col = from.col - 1;
                        }
                    }
                    if (to.row < from.row && to.col > from.col && Math.abs(to.row - from.row) === Math.abs(to.col - from.col)) {
                        if (state.board[from.row - 1][from.col + 1] === 'S') {
                            to.row = from.row - 2;
                            to.col = from.col + 2;
                        }
                        else {
                            to.row = from.row - 1;
                            to.col = from.col + 1;
                        }
                    }
                    if (to.row > from.row && to.col < from.col && Math.abs(to.row - from.row) === Math.abs(to.col - from.col)) {
                        if (state.board[from.row + 1][from.col - 1] === 'S') {
                            to.row = from.row + 2;
                            to.col = from.col - 2;
                        }
                        else {
                            to.row = from.row + 1;
                            to.col = from.col - 1;
                        }
                    }
                    if (to.row > from.row && to.col > from.col && Math.abs(to.row - from.row) === Math.abs(to.col - from.col)) {
                        if (state.board[from.row + 1][from.col + 1] === 'S') {
                            to.row = from.row + 2;
                            to.col = from.col + 2;
                        }
                        else {
                            to.row = from.row + 1;
                            to.col = from.col + 1;
                        }
                    }
                }
                dragDone(from, to);
            }
            else {
                // Drag continue
                var size = getSquareWidthHeight();
                setDraggingPieceTopLeft({
                    top: y - 0.12 * gameArea.clientHeight - size.height / 2,
                    left: x - size.width / 2
                });
            }
        }
        if (type === "touchend" || type === "touchcancel" || type === "touchleave") {
            // drag ended
            // return the piece to it's original style (then angular will take care to hide it).
            setDraggingPieceTopLeft(getSquareTopLeft(draggingStartedRowCol.row, draggingStartedRowCol.col));
            draggingStartedRowCol = { row: -1, col: -1 };
            draggingPiece = null;
        }
    }
    game.handleDragEvent = handleDragEvent;
    function setDraggingPieceTopLeft(topLeft) {
        var originalSize = getSquareTopLeft(draggingStartedRowCol.row, draggingStartedRowCol.col);
        draggingPiece.style.left = (topLeft.left - originalSize.left) + "px";
        draggingPiece.style.top = (topLeft.top - originalSize.top) + "px";
    }
    function getSquareWidthHeight() {
        return {
            width: gameArea.clientWidth / colsNum,
            height: gameArea.clientHeight * 0.75 / rowsNum
        };
    }
    function getSquareTopLeft(row, col) {
        var size = getSquareWidthHeight();
        return {
            top: row * size.height,
            left: col * size.width
        };
    }
    function getSquareCenterXY(row, col) {
        var size = getSquareWidthHeight();
        return {
            x: col * size.width + size.width / 2,
            y: row * size.height + size.height / 2
        };
    }
    //resizeGameAreaService.setWidthToHeight(0.5);
    function dragDone(from, to) {
        try {
            console.log("turnIndex " + turnIndex);
            var move = gameLogic.createMove(state.board, from.row, from.col, to.row, to.col, turnIndex);
            gameService.makeMove(move);
        }
        catch (e) {
            //$log.info(e);
            console.log(["Invalid move:", from.row, from.col, to.row, to.col]);
            console.log(draggingStartedRowCol);
            console.log(draggingStartedRowCol);
            return;
        }
    }
    var countArrivedSheep = function () {
        var count = 0;
        for (var i = 0; i < 3; i++) {
            for (var j = 2; j < 5; j++) {
                if (state.board[i][j] === 'S')
                    count++;
            }
        }
        return count;
    };
    var countEatenSheep = function () {
        var count = 0;
        for (var i = 0; i < 7; i++) {
            for (var j = 0; j < 7; j++) {
                if (state.board[i][j] === 'S')
                    count++;
            }
        }
        return 20 - count;
    };
    //aiService
    var isContinue = false;
    var currentRow = 0;
    var currentCol = 0;
    function createComputerMove(board, playerIndex) {
        var possibleMoves = gameLogic.getPossibleMoves(board, playerIndex);
        if (playerIndex === 0) {
            if (possibleMoves.length !== 0) {
                var randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
                return randomMove;
            }
        }
        var move;
        try {
            if (isContinue) {
                for (var i = 0; i < possibleMoves.length; i++) {
                    if (possibleMoves[i][2].set.value.rowBefore !== currentRow || possibleMoves[i][2].set.value.colBefore !== currentCol) {
                        possibleMoves.splice(i, 1);
                    }
                }
            }
            if (possibleMoves.length === 1) {
                move = possibleMoves[0];
            }
            else if (isJump(possibleMoves[0])) {
                var max = 1;
                move = possibleMoves[0];
                for (var i = 0; i < possibleMoves.length; i++) {
                    var temp = 1 + jumpNumbers(possibleMoves[i]);
                    if (temp > max) {
                        max = temp;
                        move = possibleMoves[i];
                    }
                }
            }
            else {
                var max = 0;
                move = possibleMoves[0];
                for (var i = 0; i < possibleMoves.length; i++) {
                    var temp = jumpNumbers(possibleMoves[i]);
                    if (temp > max) {
                        max = temp;
                        move = possibleMoves[i];
                    }
                }
                if (max === 0) {
                    var maxSheep = 0; //find the move which will be close to the largest number of sheep
                    //move = possibleMoves[0];
                    for (var i = 0; i < possibleMoves.length; i++) {
                        var temp = sheepNumber(possibleMoves[i]);
                        if (temp > maxSheep) {
                            maxSheep = temp;
                            move = possibleMoves[i];
                        }
                    }
                    if (maxSheep === 0) {
                        if (possibleMoves[0][2].set.value.rowBefore < 3) {
                            for (var i = 0; i < possibleMoves.length; i++) {
                                if (possibleMoves[i][2].set.value.rowBefore < possibleMoves[i][2].set.value.rowAfter) {
                                    move = possibleMoves[i];
                                    break;
                                }
                            }
                        }
                        else {
                            for (var i = 0; i < possibleMoves.length; i++) {
                                if (possibleMoves[i][2].set.value.rowBefore > possibleMoves[i][2].set.value.rowAfter) {
                                    move = possibleMoves[i];
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        }
        catch (e) {
            move = possibleMoves[0];
        }
        //console.log("isJump" + isJump(move));
        if (!isJump(move)) {
            isContinue = false;
        }
        else {
            var tempMoves = gameLogic.getPossibleMoves(move[1].set.value, 1);
            var i;
            for (i = 0; i < tempMoves.length; i++) {
                if (isJump(tempMoves[i]) && tempMoves[i][2].set.value.rowBefore === move[2].set.value.rowAfter && tempMoves[i][2].set.value.colBefore === move[2].set.value.colAfter) {
                    isContinue = true;
                    currentRow = move[2].set.value.rowAfter;
                    currentCol = move[2].set.value.colAfter;
                    break;
                }
            }
            console.log("i is " + i);
            if (i === tempMoves.length) {
                isContinue = false;
            }
        }
        return move;
    }
    function jumpNumbers(move) {
        var possibleMoves = gameLogic.getPossibleMoves(move[1].set.value, 1);
        for (var i = 0; i < possibleMoves.length; i++) {
            if (possibleMoves[i][2].set.value.rowBefore !== move[2].set.value.rowAfter || possibleMoves[i][2].set.value.colBefore !== move[2].set.value.colAfter) {
                possibleMoves.splice(i, 1);
            }
        }
        if (possibleMoves.length === 0)
            return 0;
        if (!isJump(possibleMoves[0]))
            return 0;
        if (possibleMoves.length === 1 && isJump(possibleMoves[0]))
            return 1;
        var max = 0;
        var move = possibleMoves[0];
        for (var i = 0; i < possibleMoves.length; i++) {
            var temp = jumpNumbers(possibleMoves[i]);
            if (temp > max) {
                max = temp;
                move = possibleMoves[i];
            }
        }
        return 1 + max;
    }
    function isJump(move) {
        var rowBefore = move[2].set.value.rowBefore;
        var rowAfter = move[2].set.value.rowAfter;
        var colBefore = move[2].set.value.colBefore;
        var colAfter = move[2].set.value.colAfter;
        if (Math.abs(rowBefore - rowAfter) === 2 || Math.abs(colBefore - colAfter) === 2)
            return true;
        else
            return false;
    }
    function sheepNumber(move) {
        var row = move[2].set.value.rowAfter;
        var col = move[2].set.value.colAfter;
        var board = move[1].set.value;
        //console.log("board:", board);
        var count = 0;
        //console.log("board:", board[row + i][col + j]);
        for (var i = -1; i < 2; i++) {
            for (var j = -1; j < 2; j++) {
                //console.log("board:", board[row + i][col + j]);
                if (i === 0 && j === 0)
                    continue;
                if (row + i < 0 || row + i > 6 || col + j < 0 || col + j > 6)
                    continue;
                if (board[row + i][col + j] === 'S') {
                    count++;
                    console.log("count: ", row + i, col + j);
                }
            }
        }
        return count;
    }
})(game || (game = {}));
angular.module('myApp', ['ngTouch', 'ui.bootstrap', 'gameServices'])
    .run(function () {
    $rootScope['game'] = game;
    translate.setLanguage('en', {
        "RULES_OF_HALATAFL": "Welcome to Halatafl!",
        "RULES_SLIDE1": "Rules: The goal of sheep is to occupy the 3x3 paddock area, as is shown here. Sheep can move only sideways and forwards but not backwards.",
        "RULES_SLIDE2": "The goal of wolves is to catch 12 sheep to prevent them from filling the paddock area. Wolves can move in any direction along the game board's grid lines.",
        "RULES_SLIDE3": "To catch a sheep, wolves jump over them, one or more times. Wolves must jump if they can. Enjoy!",
        "CLOSE": "Close"
    });
    game.init();
});
