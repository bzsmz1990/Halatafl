/**
 * Created by Wenzhao on 3/4/15.
 */

angular.module('myApp')
    .controller('Ctrl',
    ['$scope', '$log', '$timeout',
        'gameService', 'gameLogic', 'resizeGameAreaService',
        function ($scope, $log, $timeout,
                  gameService, gameLogic, resizeGameAreaService) {

            'use strict';

            resizeGameAreaService.setWidthToHeight(0.666666667);


            function sendComputerMove() {
                var items = gameLogic.getPossibleMoves($scope.board, $scope.turnIndex);
                gameService.makeMove(items[Math.floor(Math.random()*items.length)]);
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
                $scope.isYourTurn = params.turnIndexAfterMove >= 0 && // game is ongoing
                params.yourPlayerIndex === params.turnIndexAfterMove; // it's my turn
                $scope.turnIndex = params.turnIndexAfterMove;

                if ($scope.board === undefined) {
                    $scope.board = gameLogic.getInitialBoard();
                    initializeUiState();
                    //$log.info($scope.board[0][0]);
                } else {
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
            updateUI({stateAfterMove: {}, turnIndexAfterMove: 0, yourPlayerIndex:-2});
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
                for(var i = 0; i < 7; i++) {
                    for(var j = 0; j < 7; j++) {
                        var char = $scope.board[i][j];
                        var uiSquare = $scope.uiState[i][j];
                        //$log.info(char);
                        switch(char) {
                            case 'F': uiSquare.content = 1; $log.info(uiSquare.content);break;
                            case 'S': uiSquare.content = 0; $log.info(uiSquare.content);break;
                            default: uiSquare.content = -1; $log.info(uiSquare.content);
                        }
                    }
                }
                var char = $scope.board[$scope.secondClickRow][$scope.secondClickCol];
                var uISquareCopy = {
                    content: char === 'S'? 0 : 1, //0 is sheep, 1 is fox, -1 is empty
                    isSelected: false  //,
                    //pieceSrc: 'img/empty'
                };
                $scope.uiState[$scope.secondClickRow][$scope.secondClickCol] = uISquareCopy;
                //$scope.uiState[$scope.secondClickRow][$scope.secondClickCol].content = 0;
                //$scope.uiState[2][0].pieceSrc = 'img/sheep';
                //$log.info($scope.uiState[$scope.secondClickRow][$scope.secondClickCol].content);
                //$log.info($scope.uiState[3][1].content);
            }

            $scope.getSquare = function(row, col) {
                return $scope.uiState[row][col];
            };


            $scope.isFirstClick = true;
            $scope.firstClickRow;
            $scope.firstClickCol;
            $scope.secondClickRow;
            $scope.secondClickCol;

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
                    return;
                }
                try {
                    $scope.secondClickRow = row;
                    $scope.secondClickCol = col;
                    var move = gameLogic.createMove($scope.board, $scope.firstClickRow, $scope.firstClickCol, $scope.secondClickRow, $scope.secondClickCol, $scope.turnIndex);
                    //$scope.isYourTurn = false; // to prevent making another move
                    gameService.makeMove(move);
                    $scope.isFirstClick = true;
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

