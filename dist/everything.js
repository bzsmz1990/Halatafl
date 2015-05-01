/**
 * Created by Wenzhao on 2/17/15.
 */


'use strict';

angular.module('myApp', ['ngTouch', 'ui.bootstrap']).factory('gameLogic', function() {


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

});;/**
 * Created by Wenzhao on 3/4/15.
 */

angular.module('myApp')
    .controller('Ctrl',
    ['$scope', '$log', '$timeout', '$rootScope',
        'gameService', 'stateService','gameLogic',
        'resizeGameAreaService','dragAndDropService',
        function ($scope, $log, $timeout, $rootScope,
                  gameService, stateService, gameLogic, resizeGameAreaService, dragAndDropService
        ) {

            'use strict';

            resizeGameAreaService.setWidthToHeight(0.666666667);

            $scope.randomMove;
            $scope.justHasRandomMove = false;

            //$scope.isContinue = false;
            //$scope.currentRow = 0;
            //$scope.currentCol = 0;

            function sendComputerMove() {
                var move = createComputerMove($scope.board, $scope.turnIndex);
                    // at most 1 second for the AI to choose a move (but might be much quicker)
                    //{millisecondsLimit: 1000});
                //console.log("computer move: ", move);
                gameService.makeMove(move);


                //var items = gameLogic.getPossibleMoves($scope.board, $scope.turnIndex);
                //if (items.length !== 0) {
                  //  $scope.randomMove = items[Math.floor(Math.random() * items.length)];
                   // $scope.justHasRandomMove = true;
                    //setTimeout(function () {var i = 0;}, 2000);
                   // gameService.makeMove($scope.randomMove);

               // }
                //what if there is no available move for wolf?
            }



            /*function sendComputerMove() {
             gameService.makeMove(aiService.createComputerMove($scope.board, $scope.turnIndex,
             // at most 1 second for the AI to choose a move (but might be much quicker)
             {millisecondsLimit: 1000}));
             }*/

            //$scope.turnIndex = 0;
            //$scope.isYourTurn = true;
            function updateUI(params) {
                $scope.board = params.stateAfterMove.board;
                $scope.delta = params.stateAfterMove.delta;
                var notFirstTime = true;
                if ($scope.board === undefined) {
                    $scope.board = gameLogic.getInitialBoard();
                    notFirstTime = false;
                    initializeUiState();
                    //$log.info($scope.board[0][0]);

                }
                $scope.isYourTurn = params.turnIndexAfterMove >= 0 && // game is ongoing
                params.yourPlayerIndex === params.turnIndexAfterMove; // it's my turn
                $scope.turnIndex = params.turnIndexAfterMove;
                if (notFirstTime) {
                    updateUiState();
                }

                // Is it the computer's turn?
                if ($scope.isYourTurn &&
                    params.playersInfo[params.yourPlayerIndex].playerId === '') {
                    $scope.isYourTurn = false; // to make sure the UI won't send another move.
                    // Waiting 0.5 seconds to let the move animation finish; if we call aiService
                    // then the animation is paused until the javascript finishes.
                    $timeout(sendComputerMove, 1200);
                }

            }

            // Before getting any updateUI, we show an empty board to a viewer (so you can't perform moves).
            //updateUI({stateAfterMove: {}, turnIndexAfterMove: 0, yourPlayerIndex:-2});
            //updateUI({stateAfterMove: {}, turnIndexAfterMove: 0, yourPlayerIndex:0});

            $scope.justInitialize = false;
            function initializeUiState() {
                // Initialize the ui state as an array first
                $scope.uiState = [];

                var defaultUISquare = {
                        content: -1, //0 is sheep, 1 is fox, -1 is empty
                        isSelected: false  //,
                        //pieceSrc: 'img/empty'
                    },
                    row,
                    col,
                    board_help = gameLogic.getInitialBoard();


                for (row = 0; row < 7; row++) {
                    for (col = 0; col < 7; col++) {
                        if (col === 0)
                            $scope.uiState.push([]);
                        if (board_help[row][col] === 'F') {
                            var foxUISquare = angular.copy(defaultUISquare);
                            foxUISquare.content = 1;
                            //foxUISquare.pieceSrc = 'img/fox';
                            $scope.uiState[row][col] = foxUISquare;
                        }
                        else if (board_help[row][col] === 'S') {
                            var sheepUISquare = angular.copy(defaultUISquare);
                            sheepUISquare.content = 0;
                            //sheepUISquare.pieceSrc = 'img/sheep';
                            $scope.uiState[row][col] = sheepUISquare;
                        }
                        else $scope.uiState[row][col] = defaultUISquare;


                    }
                }
                $scope.justInitialize = true;




            }

            $scope.isFirstClick = true;
            $scope.isSecondClick = 0; // 0: no value, 1: is first click, 2: is second click
            $scope.firstClickRow;
            $scope.firstClickCol;
            $scope.secondClickRow;
            $scope.secondClickCol;

            function updateUiState() {


                for(var i = 0; i < 7; i++) {
                    for(var j = 0; j < 7; j++) {
                        var char = $scope.board[i][j];
                        var uiSquare = $scope.uiState[i][j];
                        var uISquareCopy = {
                            content: char === 'S' ? 0 : (char === 'F' ? 1 : -1), //0 is sheep, 1 is fox, -1 is empty
                            isSelected: $scope.isSecondClick === 1 ? uiSquare.isSelected : false  //,
                            //pieceSrc: 'img/empty'

                        };
                        //document.getElementById('e2e_test_img_' + i + 'x' + j).className = 'enlarge1';
                        $scope.uiState[i][j] = uISquareCopy;
                        //if ($scope.justInitialize)
                        //  document.getElementById('e2e_test_img_' + i + 'x' + j).className = 'enlarge1';
                    }
                }

                $scope.justInitialize = false;
                $scope.isSecondClick = 0;

                $log.info($scope.justHasRandomMove);

                //animation
                var row = $scope.delta.rowAfter;
                var col = $scope.delta.colAfter;
                var img = document.getElementById('e2e_test_img_' + row + 'x' + col);
                if (img.className === 'enlarge1')
                    img.className = 'enlarge2';
                else
                    img.className = 'enlarge1';
                $log.info("current" + img.className);
                var rowBefore = $scope.delta.rowBefore;
                var colBefore = $scope.delta.colBefore;
                /*if (Math.abs(row - rowBefore) === 2 || (Math.abs(col - colBefore)) === 2) {
                 var uISquareCopy = {
                 content: 0,
                 isSelected: $scope.isSecondClick === 1 ? uiSquare.isSelected : false
                 //pieceSrc: 'img/empty'
                 };
                 $scope.uiState[(row + rowBefore) / 2][(col + colBefore) / 2] = uISquareCopy;
                 var img2 = document.getElementById('e2e_test_img_' + (row + rowBefore) / 2 + 'x' + (col + colBefore) / 2);
                 img2.className = 'disappear';
                 setTimeout(function () {
                 //if (Math.abs(row - rowBefore) === 2 || (Math.abs(col - colBefore)) === 2)
                 img2.className = 'invisible'
                 $log.info("current" + img2.className);
                 }, 1000);
                 //$log.info("content" + uISquareCopy2.content);
                 }
                 /*
                 var uISquareCopy = {
                 content: -1,
                 isSelected: $scope.isSecondClick === 1 ? uiSquare.isSelected : false
                 //pieceSrc: 'img/empty'
                 };
                 $scope.uiState[(row + rowBefore) / 2][(col + colBefore) / 2] = uISquareCopy;
                 */




                for(var i = 0; i < 7; i++) {
                    for(var j = 0; j < 7; j++) {
                        //var char = $scope.board[i][j];
                        //var uiSquare = $scope.uiState[i][j];
                        //$log.info(char);
                        $log.info($scope.uiState[i][j].content);
                        //$log.info($scope.board[i][j]);
                    }
                }
                $log.info("turnIndex " + $scope.turnIndex);
                $log.info("current" + img.className);
            }

            $scope.getSquare = function(row, col) {
                return $scope.uiState[row][col];
            };





            //$scope.turnIndex = 0;


            //$log.info("turnIndex " + $scope.turnIndex);

            //drag and drop
            var gameArea = document.getElementById("gameArea");
            $log.info("clientWidth" + gameArea.clientWidth);
            $log.info("clientHeight" + gameArea.clientHeight);
            //$log.info(gameArea);
            var rowsNum = 7;
            var colsNum = 7;
            var draggingStartedRowCol = null; // The {row: YY, col: XX} where dragging started.
            var draggingPiece = null;
            var nextZIndex = 61;
            //window.handleDragEvent = handleDragEvent;
            dragAndDropService.addDragListener("gameArea", handleDragEvent);
            function handleDragEvent(type, clientX, clientY) {
                // Center point in gameArea

                //$log.info("X"+clientX);
                //$log.info("Y"+clientY);
                //$log.info("left"+gameArea.offsetLeft);
                //$log.info("left"+gameArea.offsetTop);
                var x = clientX - gameArea.offsetLeft;
                var y = clientY - gameArea.offsetTop;
                var row, col;
                // Is outside gameArea?
                if (x < 0 || y < 0 || x >= gameArea.clientWidth || y >= gameArea.clientHeight) {
                    //draggingLines.style.display = "none";
                    if (draggingPiece) {
                        // Drag the piece where the touch is (without snapping to a square).
                        var size = getSquareWidthHeight();
                        setDraggingPieceTopLeft({top: y - size.height / 2, left: x - size.width / 2});
                    } else {
                        return;
                    }
                } else {

                    // Inside gameArea. Let's find the containing square's row and col
                    var col = Math.floor(colsNum * x / gameArea.clientWidth);
                    //if (y < 0.05 * gameArea.clientHeight  || y > 0.95 * gameArea.clientHeight ) return;
                    var row = Math.floor(rowsNum * (y - 0.12 * gameArea.clientHeight ) / gameArea.clientHeight / 0.75);
                    //if ($scope.turnIndex == 1) row = row - 1;
                    if (type === "touchstart" && !draggingStartedRowCol) {
                        // drag started
                        $log.info("turnIndex " + $scope.turnIndex);
                        if ($scope.board[row][col] != '' || $scope.board[row][col] != 'X') {
                            //if (($scope.board[row][col] == 'F' && $scope.turnIndex === 1) || ($scope.board[row][col] == 'S' && $scope.turnIndex === 0)) {
                            draggingStartedRowCol = {row: row, col: col};
                            $log.info("firstrow" + draggingStartedRowCol.row);
                            draggingPiece = document.getElementById('e2e_test_img_' + row + 'x' + col);
                            //draggingPiece = document.getElementById("MyPiece" + draggingStartedRowCol.row + "x" + draggingStartedRowCol.col);
                            //$log.info("here");
                            //$log.info(draggingPiece === null);
                            $log.info("draggingPiece" + draggingPiece);
                            draggingPiece.style['z-index'] = ++nextZIndex;
                            $log.info("style" + draggingPiece.style['z-index']);
                        }
                    }
                    if (!draggingPiece) {
                        return;
                    }
                    //$log.info(type);
                    if (type === "touchend") {
                        //$log.info("turnIndex " + $scope.turnIndex);
                        var from = draggingStartedRowCol;
                        var to = {row: row, col: col};
                        if ($scope.turnIndex === 0) {
                            if (from.row > to.row) to.row = from.row - 1;
                            if (from.col < to.col) to.col = from.col + 1;
                            if (from.col > to.col) to.col = from.col - 1;
                        }
                        else {
                            if (to.row === from.row && to.col < from.col) { //left
                                if ($scope.board[to.row][from.col - 1] === 'S')
                                    to.col = from.col - 2;
                                else to.col = from.col - 1;
                            }
                            if (to.row === from.row && to.col > from.col) { //right
                                if ($scope.board[to.row][from.col + 1] === 'S')
                                    to.col = from.col + 2;
                                else to.col = from.col + 1;
                            }
                            if (to.col === from.col && to.row < from.row) { //top
                                if ($scope.board[from.row - 1][from.col] === 'S')
                                    to.row = from.row - 2;
                                else to.row = from.row - 1;
                            }
                            if (to.col === from.col && to.row > from.row) { //bottom
                                if ($scope.board[from.row + 1][from.col] === 'S')
                                    to.row = from.row + 2;
                                else to.row = from.row + 1;
                            }
                            if (to.row < from.row && to.col < from.col && Math.abs(to.row - from.row) === Math.abs(to.col - from.col)) { //top left
                                if ($scope.board[from.row - 1][from.col - 1] === 'S') {
                                    to.row = from.row - 2;
                                    to.col = from.col - 2;
                                }
                                else {
                                    to.row = from.row - 1;
                                    to.col = from.col - 1;
                                }
                            }
                            if (to.row < from.row && to.col > from.col && Math.abs(to.row - from.row) === Math.abs(to.col - from.col)) { //top right
                                if ($scope.board[from.row - 1][from.col + 1] === 'S') {
                                    to.row = from.row - 2;
                                    to.col = from.col + 2;
                                }
                                else {
                                    to.row = from.row - 1;
                                    to.col = from.col + 1;
                                }
                            }
                            if (to.row > from.row && to.col < from.col && Math.abs(to.row - from.row) === Math.abs(to.col - from.col)) { //bottom left
                                if ($scope.board[from.row + 1][from.col - 1] === 'S') {
                                    to.row = from.row + 2;
                                    to.col = from.col - 2;
                                }
                                else {
                                    to.row = from.row + 1;
                                    to.col = from.col - 1;
                                }
                            }
                            if (to.row > from.row && to.col > from.col && Math.abs(to.row - from.row) === Math.abs(to.col - from.col)) { //bottom right
                                if ($scope.board[from.row + 1][from.col + 1] === 'S') {
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
                        //$log.info(draggingStartedRowCol);
                        //$log.info(to);
                        //dragDone(from, to);
                    } else {
                        // Drag continue
                        var size = getSquareWidthHeight();
                        setDraggingPieceTopLeft({top: y - 0.12 * gameArea.clientHeight - size.height / 2, left: x - size.width / 2});
                        //setDraggingPieceTopLeft(getSquareTopLeft(row, col));
                        //draggingLines.style.display = "inline";
                        //var centerXY = getSquareCenterXY(row, col);
                        //verticalDraggingLine.setAttribute("x1", centerXY.x);
                        //verticalDraggingLine.setAttribute("x2", centerXY.x);
                        //horizontalDraggingLine.setAttribute("y1", centerXY.y);
                        //horizontalDraggingLine.setAttribute("y2", centerXY.y);
                    }
                }
                if (type === "touchend" || type === "touchcancel" || type === "touchleave") {
                    // drag ended
                    // return the piece to it's original style (then angular will take care to hide it).
                    setDraggingPieceTopLeft(getSquareTopLeft(draggingStartedRowCol.row, draggingStartedRowCol.col));
                    //draggingLines.style.display = "none";
                    //$log.info(type);
                    //$log.info(draggingStartedRowCol);
                    draggingStartedRowCol = null;
                    //$log.info(draggingStartedRowCol);
                    draggingPiece = null;
                }
            }
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
                return {top: row * size.height, left: col * size.width}
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
                $rootScope.$apply(function () {
                    try {
                        //$scope.secondClickRow = row;
                        //$scope.secondClickCol = col;
                        $log.info("turnIndex " + $scope.turnIndex);
                        var move = gameLogic.createMove($scope.board, from.row, from.col, to.row, to.col, $scope.turnIndex);
                        //$log.info("success");
                        //$scope.isYourTurn = false; // to prevent making another move
                        //$scope.isFirstClick = true;
                        //$scope.isSecondClick = 2;
                        gameService.makeMove(move);
                        //return;
                    } catch (e) {
                        //$log.info(e);
                        $log.info(["Invalid move:", from.row, from.col, to.row, to.col]);
                        //$log.info(type);
                        $log.info(draggingStartedRowCol);
                        //draggingStartedRowCol = null;
                        $log.info(draggingStartedRowCol);
                        //draggingPiece = null;
                        return;
                    }
                });
            }


            $scope.countArrivedSheep = function(){
                var count = 0;
                for (var i = 0; i < 3; i++) {
                    for (var j = 2; j < 5; j++) {
                        if ($scope.board[i][j] === 'S')
                        count++;
                    }
                }
                return count;
            }


            $scope.countEatenSheep = function() {
                var count = 0;
                for (var i = 0; i < 7; i++) {
                    for (var j = 0; j < 7; j++) {
                        if ($scope.board[i][j] === 'S')
                            count++;
                    }
                }
                return 20 - count;
            }


            //$(document).ready(function () {
              //  fontSize();
            //});

            //function fontSize() {
              //  document.getElementById('first').css('font-size',gameArea.clientHeight.toString() + "px");
                //return 45 + "%";
            //}





            //aiService
            var isContinue = false;
            var currentRow = 0;
            var currentCol = 0;

            function createComputerMove(board, playerIndex) {
                var possibleMoves = gameLogic.getPossibleMoves(board, playerIndex);
                if (playerIndex === 0) {  //if it's sheep's turn
                    if (possibleMoves.length !== 0) {
                        var randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
                        return randomMove;
                    }
                }
                //if it's fox's turn
                //first eliminate the moves from the invalid fox
                //console.log("currentRow" + currentRow);
                //console.log("currentCol" + currentCol);
                //console.log("isContinue" + isContinue);
                var move;
                try {
                    if (isContinue) {
                        for (var i = 0; i < possibleMoves.length; i++) {
                            if (possibleMoves[i][2].set.value.rowBefore !== currentRow || possibleMoves[i][2].set.value.colBefore !== currentCol) {
                                possibleMoves.splice(i, 1);
                            }
                        }
                    }
                    if (possibleMoves.length === 1) {   //if there is only choice, then choose this one directly
                        move = possibleMoves[0];
                    }
                    else if (isJump(possibleMoves[0])) {   //if the choices are jumps, find the jump which leads to the most subsequent jumps
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
                    else {                           //only regular moves are available
                        var max = 0;
                        move = possibleMoves[0];
                        for (var i = 0; i < possibleMoves.length; i++) {
                            var temp = jumpNumbers(possibleMoves[i]);
                            if (temp > max) {
                                max = temp;
                                move = possibleMoves[i];
                            }
                        }
                        if (max === 0) {    //indicates that no move can lead to more jumps
                            var maxSheep = 0;   //find the move which will be close to the largest number of sheep
                            //move = possibleMoves[0];
                            for (var i = 0; i < possibleMoves.length; i++) {
                                var temp = sheepNumber(possibleMoves[i]);
                                if (temp > maxSheep) {
                                    maxSheep = temp;
                                    move = possibleMoves[i];
                                }
                            }
                            if (maxSheep === 0) {  //no move can lead to more sheep
                                if (possibleMoves[0][2].set.value.rowBefore < 3) {
                                    for (var i = 0; i < possibleMoves.length; i++) {
                                        if (possibleMoves[i][2].set.value.rowBefore < possibleMoves[i][2].set.value.rowAfter)
                                        {move = possibleMoves[i]; break;}
                                    }
                                }
                                else {
                                    for (var i = 0; i < possibleMoves.length; i++) {
                                        if (possibleMoves[i][2].set.value.rowBefore > possibleMoves[i][2].set.value.rowAfter)
                                        {move = possibleMoves[i]; break;}
                                    }
                                }

                            }

                        }

                    }
                }  catch (e) {
                    move = possibleMoves[0];
                }
                //console.log("isJump" + isJump(move));
                if (!isJump(move)) {isContinue = false;}
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
                    if (i === tempMoves.length) {isContinue = false;}
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
                if (possibleMoves.length === 0) return 0;
                if (!isJump(possibleMoves[0])) return 0;
                if (possibleMoves.length === 1 && isJump(possibleMoves[0])) return 1;
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
                var rowBefore  = move[2].set.value.rowBefore;
                var rowAfter  = move[2].set.value.rowAfter;
                var colBefore  = move[2].set.value.colBefore;
                var colAfter  = move[2].set.value.colAfter;
                if (Math.abs(rowBefore - rowAfter) === 2 || Math.abs(colBefore - colAfter) === 2)
                    return true;
                else return false;
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
                        if (i === 0 && j === 0) continue;
                        if (row + i < 0 || row + i > 6 || col + j < 0 || col + j > 6) continue;
                        if (board[row + i][col + j] === 'S') {
                            count++;
                            console.log("count: ", row + i, col + j);
                        }
                    }
                }
                return count;
            }



            window.e2e_test_stateService = stateService; // to allow us to load any state in our e2e tests.

             //$log.info("turnIndex " + $scope.turnIndex);
             //$scope.cellClicked = function (row, col) {
             //$log.info(["Clicked on cell:", row, col]);
             //if (!$scope.isYourTurn) {
             //return;
             //}
             //$log.info("turnIndex " + $scope.turnIndex);
             //var rightOne = ($scope.turnIndex === 1) ? 'F' : 'S';
             //var wrongOne = ($scope.turnIndex === 1) ? 'S' : 'F';
             //if ($scope.board[row][col] !== rightOne && $scope.isFirstClick) {
             //return;
             //}
             //if ($scope.board[row][col] === wrongOne && !$scope.isFirstClick) {
             //$scope.isFirstClick = true;
             //$scope.uiState[$scope.firstClickRow][$scope.firstClickCol].isSelected = false;
             //return;
             //}
             //if ($scope.isFirstClick || (!$scope.isFirstClick && $scope.board[$scope.firstClickRow][$scope.firstClickCol] === $scope.board[row][col])) {
             //if (!$scope.isFirstClick) {
             //$scope.uiState[$scope.firstClickRow][$scope.firstClickCol].isSelected = false;
             //}
             //$scope.firstClickRow = row;
             //$scope.firstClickCol = col;
             //$scope.uiState[row][col].isSelected = true;
             //$scope.isFirstClick = false;
             //$scope.isSecondClick = 1;
             //return;
             //}
             //try {
             //$scope.secondClickRow = row;
             //$scope.secondClickCol = col;
             //var move = gameLogic.createMove($scope.board, $scope.firstClickRow, $scope.firstClickCol, $scope.secondClickRow, $scope.secondClickCol, $scope.turnIndex);
             ////$scope.isYourTurn = false; // to prevent making another move
             //$scope.isFirstClick = true;
             //$scope.isSecondClick = 2;
             //gameService.makeMove(move);
             //} catch (e) {
             ////$log.info(e);
             //$log.info(["Invalid move:", $scope.firstClickRow, $scope.firstClickCol, $scope.secondClickRow, $scope.secondClickCol]);
             //return;
             //}
             //};




            gameService.setGame({
                gameDeveloperEmail: "zangwz@gmail.com",
                minNumberOfPlayers: 2,
                maxNumberOfPlayers: 2,
                isMoveOk: gameLogic.isMoveOk,
                updateUI: updateUI
            });
        }]);