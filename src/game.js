/**
 * Created by Wenzhao on 3/4/15.
 */

angular.module('myApp')
    .controller('Ctrl',
    ['$scope', '$log', '$timeout', '$rootScope',
        'gameService', 'stateService','gameLogic',
        'resizeGameAreaService',
        function ($scope, $log, $timeout, $rootScope,
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
                        //setTimeout(function () {var i = 0;}, 2000);
                        gameService.makeMove($scope.randomMove);

                    }
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

                for(var i = 0; i < 7; i++) {
                    for(var j = 0; j < 7; j++) {
                        var char = $scope.board[i][j];
                        var uiSquare = $scope.uiState[i][j];
                        var uISquareCopy = {
                            content: char === 'S' ? 0 : (char === 'F' ? 1 : -1), //0 is sheep, 1 is fox, -1 is empty
                            isSelected: $scope.isSecondClick === 1 ? uiSquare.isSelected : false  //,
                            //pieceSrc: 'img/empty'
                        };

                        $scope.uiState[i][j] = uISquareCopy;
                    }
                }

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
                var rowBefore = $scope.delta.rowBefore;
                var colBefore = $scope.delta.colBefore;
                if (Math.abs(row - rowBefore) === 2 || (Math.abs(col - colBefore)) === 2) {
                    var uISquareCopy = {
                        content: 0,
                        isSelected: $scope.isSecondClick === 1 ? uiSquare.isSelected : false
                        //pieceSrc: 'img/empty'
                    };
                    $scope.uiState[(row + rowBefore) / 2][(col + colBefore) / 2] = uISquareCopy;
                    var img2 = document.getElementById('e2e_test_img_' + (row + rowBefore) / 2 + 'x' + (col + colBefore) / 2);
                    img2.className = 'disappear';
                    setTimeout(function () {
                           img2.className = 'invisible'
                    }, 2000);
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
             window.handleDragEvent = handleDragEvent;
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








            window.e2e_test_stateService = stateService; // to allow us to load any state in our e2e tests.

            /*
            $log.info("turnIndex " + $scope.turnIndex);

            $scope.cellClicked = function (row, col) {
                $log.info(["Clicked on cell:", row, col]);
                if (!$scope.isYourTurn) {
                    return;
                }
                $log.info("turnIndex " + $scope.turnIndex);
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
            */



            gameService.setGame({
                gameDeveloperEmail: "zangwz@gmail.com",
                minNumberOfPlayers: 2,
                maxNumberOfPlayers: 2,
                isMoveOk: gameLogic.isMoveOk,
                updateUI: updateUI
            });
        }]);









