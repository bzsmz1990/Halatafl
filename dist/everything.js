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
        var i, j, l, k;
        // if it's foxes' turn
        if (turnIndexBeforeMove === 1) {
            for (i = 0; i < 7; i++) {
                for (j = 0; j < 7; j++) {
                    if (board[i][j] !== 'F') continue;
                    for (l = 0; l < 7 ; l++) {
                        for (k = 0; k < 7; k++) {
                            try {
                                possibleMoves.push(createMove(board, i, j, l, k, turnIndexBeforeMove));
                            } catch(e) {}
                        }
                    }
                }
            }
        }
        else {  // if it's sheep's turn
            for (i = 0; i < 7; i++) {
                for (j = 0; j < 7; j++) {
                    if (board[i][j] !== 'S') continue;
                    for (l = 0; l < 7 ; l++) {
                        for (k = 0; k < 7; k++) {
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
            if (turnIndexBeforeMove === 1 && isJump && hasJumpPossibility(boardAfterMove))
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
            else if (turnIndexBeforeMove === 0 && !hasJumpPossibility(boardAfterMove)) {
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

    function hasJumpPossibility(board) {
        var rowFox1,colFox1,i, j,rightCol,rightRow;
        var doesJumpExist = false;
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
                if (i === 0 && j === 0) continue; //no need to check itself
                if ((colFox1 + rowFox1) % 2 !== 0 && i !== 0 && j !== 0) continue; //no such directions for this vertex
                rightCol = colFox1 + 2 * i;
                rightRow = rowFox1 + 2 * j;
                if (rightCol > -1 && rightCol < 7 && rightRow > -1 && rightRow < 7 && board[rightRow][rightCol] === '' && board[(rightRow + rowFox1) / 2][(rightCol + colFox1) / 2] === 'S') {
                    doesJumpExist = true; //jump possibility exists
                }
            }
        }
        if(doesJumpExist === false) {
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
        }
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
    ['$scope', '$log', '$timeout',
        'gameService', 'stateService','gameLogic',
        'resizeGameAreaService',
        function ($scope, $log, $timeout,
                  gameService, stateService, gameLogic, resizeGameAreaService
        ) {

            'use strict';

            resizeGameAreaService.setWidthToHeight(0.666666667);

            $scope.randomMove;
            $scope.justHasRandomMove = false;
            function sendComputerMove() {
                var items = gameLogic.getPossibleMoves($scope.board, $scope.turnIndex);
                if (items.length !== 0) {
                    $scope.randomMove = items[Math.floor(Math.random() * items.length)];
                    $scope.justHasRandomMove = true;
                    gameService.makeMove($scope.randomMove);
                }
                //what is there is no available move for wolf?

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
                 $timeout(sendComputerMove, 500);
                 }
            }

            // Before getting any updateUI, we show an empty board to a viewer (so you can't perform moves).
            //updateUI({stateAfterMove: {}, turnIndexAfterMove: 0, yourPlayerIndex:-2});
            //updateUI({stateAfterMove: {}, turnIndexAfterMove: 0, yourPlayerIndex:0});


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
            }

            $scope.isFirstClick = true;
            $scope.isSecondClick = 0; // 0: no value, 1: is first click, 2: is second click
            $scope.firstClickRow;
            $scope.firstClickCol;
            $scope.secondClickRow;
            $scope.secondClickCol;

            function updateUiState() {
                /*$log.info("updateuI");
                 $log.info($scope.firstClickRow);
                 $log.info($scope.firstClickCol);
                 $log.info($scope.board[$scope.secondClickRow][$scope.secondClickCol]);
                 $scope.uiState[$scope.firstClickRow][$scope.firstClickCol].pieceSrc = 'img/empty';
                 $scope.uiState[$scope.firstClickRow][$scope.firstClickCol].isSelected = false;
                 $log.info($scope.board[0][0]);
                 $log.info($scope.uiState[0][0].pieceSrc);
                 $log.info($scope.secondClickRow);
                 $log.info($scope.secondClickCol);
                 //$scope.uiState[2][2].pieceSrc = ($scope.board[$scope.secondClickRow][$scope.secondClickCol] === 'S') ? 'img/sheep' : 'img/empty';
                 $log.info($scope.uiState[0][0]);
                 $scope.uiState[$scope.secondClickRow][$scope.secondClickCol].pieceSrc = ($scope.board[$scope.secondClickRow][$scope.secondClickCol] === 'F') ? 'img/fox' : 'img/sheep';
                 $log.info($scope.board[0][2]);
                 //$log.info($scope.uiState[$scope.firstClickRow][$scope.firstClickCol].pieceSrc);
                 //$log.info($scope.uiState[$scope.secondClickRow][$scope.secondClickCol].pieceSrc);
                 $log.info($scope.board[0][0]);
                 $log.info($scope.uiState[0][0]);
                 $log.info($scope.secondClickRow);
                 $log.info($scope.secondClickCol);
                 //$scope.secondClickRow=null;
                 //$scope.secondClickCol=null;
                 if (Math.abs($scope.firstClickRow - $scope.secondClickRow) > 1 || Math.abs($scope.firstClickCol - $scope.secondClickCol) > 1) {
                 $scope.uiState[($scope.firstClickRow + $scope.secondClickRow) / 2][($scope.firstClickCol + $scope.secondClickCol) / 2].pieceSrc = 'img/empty';
                 }*/
                //$scope.board[$scope.firstClickRow][$scope.firstClickCol] = '';
                //if (Math.abs($scope.firstClickRow - $scope.secondClickRow) > 1 || Math.abs($scope.firstClickCol - $scope.secondClickCol) > 1) {
                  //  $scope.board[($scope.firstClickRow + $scope.secondClickRow) / 2][($scope.firstClickCol + $scope.secondClickCol) / 2] = '';}
                /*$scope.firstClickRow = null;
                 $scope.firstClickCol = null;
                 $scope.secondClickRow = null;
                 $scope.secondClickCol = null;*/

                //$scope.board[$scope.secondClickRow][$scope.secondClickCol] = 'S';
                //var fox_row = 0;
                //var fox_col = 2;
                for(var i = 0; i < 7; i++) {
                    for(var j = 0; j < 7; j++) {
                        var char = $scope.board[i][j];
                        var uiSquare = $scope.uiState[i][j];
                        var uISquareCopy = {
                            content: char === 'S' ? 0 : (char === 'F' ? 1 : -1), //0 is sheep, 1 is fox, -1 is empty
                            isSelected: $scope.isSecondClick === 1 ? uiSquare.isSelected : false  //,
                            //pieceSrc: 'img/empty'
                        };
                        //$log.info(char);
                        /*switch(char) {
                            case 'F': uiSquare.content = 1; $log.info(uiSquare.content);break;
                            case 'S': uiSquare.content = 0; $log.info(uiSquare.content);break;
                            default: uiSquare.content = -1; $log.info(uiSquare.content);
                        }*/
                        $scope.uiState[i][j] = uISquareCopy;
                    }
                }

                $scope.isSecondClick = 0;

                $log.info($scope.justHasRandomMove);

                /*
                //if ($scope.justHasRandomMove) {
                    var deltaValue = $scope.randomMove[2].set.value;
                    $scope.secondClickRow = deltaValue.rowAfter;
                    $scope.secondClickCol = deltaValue.colAfter;
                    $scope.justHasRandomMove = false;
                //}

                $log.info($scope.justHasRandomMove);
                */

                /*for(var i = 0; i < 7; i++) {
                    for(var j = 0; j < 7; j++) {
                        if ($scope.board[i][j] === 'F')
                            $scope.uiState[i][j].content = 1;
                        if ($scope.board[i][j] === '' || $scope.board[i][j] === 'X')
                            $scope.uiState[i][j].content = 0;
                    }
                }*/
                //$scope.uiState[fox_row][fox_col].content = 1;
                /*
                //if ($scope.secondClickRow != null && $scope.secondClickCol != null) {
                    var char = $scope.board[$scope.secondClickRow][$scope.secondClickCol];
                    var uISquareCopy = {
                        content: char === 'S' ? 0 : 1, //0 is sheep, 1 is fox, -1 is empty
                        isSelected: false  //,
                        //pieceSrc: 'img/empty'
                    };
                    $scope.uiState[$scope.secondClickRow][$scope.secondClickCol] = uISquareCopy;
                //}

                $log.info("2row" + $scope.secondClickRow);
                $log.info("2col" + $scope.secondClickCol);

                */
                for(var i = 0; i < 7; i++) {
                    for(var j = 0; j < 7; j++) {
                        //var char = $scope.board[i][j];
                        //var uiSquare = $scope.uiState[i][j];
                        //$log.info(char);
                        $log.info($scope.uiState[i][j].content);
                    }
                }
                //$scope.uiState[$scope.secondClickRow][$scope.secondClickCol].content = 0;
                //$scope.uiState[2][0].pieceSrc = 'img/sheep';
                //$log.info($scope.uiState[$scope.secondClickRow][$scope.secondClickCol].content);
                //$log.info($scope.uiState[3][1].content);
            }

            $scope.getSquare = function(row, col) {
                return $scope.uiState[row][col];
            };

            window.e2e_test_stateService = stateService; // to allow us to load any state in our e2e tests.



            $scope.cellClicked = function (row, col) {
                $log.info(["Clicked on cell:", row, col]);
                if (!$scope.isYourTurn) {
                    return;
                }
                var rightOne = ($scope.turnIndex === 1) ? 'F' : 'S';
                var wrongOne = ($scope.turnIndex === 1) ? 'S' : 'F';
                if ($scope.board[row][col] !== rightOne && $scope.isFirstClick) {
                    return;
                }
                if ($scope.board[row][col] === wrongOne && !$scope.isFirstClick) {
                    $scope.isFirstClick = true;
                    $scope.uiState[$scope.firstClickRow][$scope.firstClickCol].isSelected = false;
                    return;
                }
                if ($scope.isFirstClick || (!$scope.isFirstClick && $scope.board[$scope.firstClickRow][$scope.firstClickCol] === $scope.board[row][col])) {
                    if (!$scope.isFirstClick) {
                        $scope.uiState[$scope.firstClickRow][$scope.firstClickCol].isSelected = false;
                    }
                    $scope.firstClickRow = row;
                    $scope.firstClickCol = col;
                    $scope.uiState[row][col].isSelected = true;
                    $scope.isFirstClick = false;
                    $scope.isSecondClick = 1;
                    return;
                }
                try {
                    $scope.secondClickRow = row;
                    $scope.secondClickCol = col;
                    var move = gameLogic.createMove($scope.board, $scope.firstClickRow, $scope.firstClickCol, $scope.secondClickRow, $scope.secondClickCol, $scope.turnIndex);
                    //$scope.isYourTurn = false; // to prevent making another move
                    $scope.isFirstClick = true;
                    $scope.isSecondClick = 2;
                    gameService.makeMove(move);
                } catch (e) {
                    //$log.info(e);
                    $log.info(["Invalid move:", $scope.firstClickRow, $scope.firstClickCol, $scope.secondClickRow, $scope.secondClickCol]);
                    return;
                }
            };

            gameService.setGame({
                gameDeveloperEmail: "zangwz@gmail.com",
                minNumberOfPlayers: 2,
                maxNumberOfPlayers: 2,
                isMoveOk: gameLogic.isMoveOk,
                updateUI: updateUI
            });
        }]);








/*
 $scope.cellClicked = function (row, col) {
 $log.info(["Clicked on cell:", row, col]);
 if (!$scope.isYourTurn) {
 return;
 }
 try {
 var move = gameLogic.createMove($scope.board, row, col, $scope.turnIndex);
 $scope.isYourTurn = false; // to prevent making another move
 gameService.makeMove(move);
 } catch (e) {
 $log.info(["Cell is already full in position:", row, col]);
 return;
 }
 };
 $scope.shouldShowImage = function (row, col) {
 var cell = $scope.board[row][col];
 return cell !== "";
 };
 $scope.getImageSrc = function (row, col) {
 var cell = $scope.board[row][col];
 return cell === "X" ? "pieceX.png"
 : cell === "O" ? "pieceO.png" : "";
 };
 $scope.shouldSlowlyAppear = function (row, col) {
 return $scope.delta !== undefined &&
 $scope.delta.row === row && $scope.delta.col === col;
 };
 gameService.setGame({
 gameDeveloperEmail: "yoav.zibin@gmail.com",
 minNumberOfPlayers: 2,
 maxNumberOfPlayers: 2,
 isMoveOk: gameLogic.isMoveOk,
 updateUI: updateUI
 });
 }]);
 */

