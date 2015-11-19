/**
 * Created by Wenzhao on 3/4/15.
 */

angular.module('myApp')
  .controller('Ctrl', ['$scope', '$log', '$timeout', '$rootScope', 'gameLogic',
    function($scope, $log, $timeout, $rootScope, gameLogic
    ) {

      'use strict';

      resizeGameAreaService.setWidthToHeight(0.666666667);

      $scope.randomMove;
      $scope.justHasRandomMove = false;
      $scope.computerMove = false;

      function sendComputerMove() {

        var move = createComputerMove($scope.board, $scope.turnIndex);

        gameService.makeMove(move);

      }

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
          $scope.computerMove = true;
          $log.info($scope.computerMove);
          $timeout(sendComputerMove, 1200);
          $timeout(changeBoolean, 1000);
          $log.info($scope.computerMove);
        }

      }

      function changeBoolean() {
        $scope.computerMove = false;
      }

      $scope.justInitialize = false;

      function initializeUiState() {
        // Initialize the ui state as an array first
        $scope.uiState = [];

        var defaultUISquare = {
            content: -1, //0 is sheep, 1 is fox, -1 is empty
            isSelected: false //,
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
            } else if (board_help[row][col] === 'S') {
              var sheepUISquare = angular.copy(defaultUISquare);
              sheepUISquare.content = 0;
              //sheepUISquare.pieceSrc = 'img/sheep';
              $scope.uiState[row][col] = sheepUISquare;
            } else $scope.uiState[row][col] = defaultUISquare;


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


        for (var i = 0; i < 7; i++) {
          for (var j = 0; j < 7; j++) {
            var char = $scope.board[i][j];
            var uiSquare = $scope.uiState[i][j];
            var uISquareCopy = {
              content: char === 'S' ? 0 : (char === 'F' ? 1 : -1), //0 is sheep, 1 is fox, -1 is empty
              isSelected: $scope.isSecondClick === 1 ? uiSquare.isSelected : false //,
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


        for (var i = 0; i < 7; i++) {
          for (var j = 0; j < 7; j++) {
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

        $log.info($scope.computerMove);
        if ($scope.computerMove === true) return;
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
          } else {
            return;
          }
        } else {

          // Inside gameArea. Let's find the containing square's row and col
          var col = Math.floor(colsNum * x / gameArea.clientWidth);
          //if (y < 0.05 * gameArea.clientHeight  || y > 0.95 * gameArea.clientHeight ) return;
          var row = Math.floor(rowsNum * (y - 0.12 * gameArea.clientHeight) / gameArea.clientHeight / 0.75);
          //if ($scope.turnIndex == 1) row = row - 1;
          if (type === "touchstart" && !draggingStartedRowCol) {
            // drag started
            $log.info("turnIndex " + $scope.turnIndex);
            if ($scope.board[row][col] != '' || $scope.board[row][col] != 'X') {
              //if (($scope.board[row][col] == 'F' && $scope.turnIndex === 1) || ($scope.board[row][col] == 'S' && $scope.turnIndex === 0)) {
              draggingStartedRowCol = {
                row: row,
                col: col
              };
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
            var to = {
              row: row,
              col: col
            };
            if ($scope.turnIndex === 0) {
              if (from.row > to.row) to.row = from.row - 1;
              if (from.col < to.col) to.col = from.col + 1;
              if (from.col > to.col) to.col = from.col - 1;
            } else {
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
                } else {
                  to.row = from.row - 1;
                  to.col = from.col - 1;
                }
              }
              if (to.row < from.row && to.col > from.col && Math.abs(to.row - from.row) === Math.abs(to.col - from.col)) { //top right
                if ($scope.board[from.row - 1][from.col + 1] === 'S') {
                  to.row = from.row - 2;
                  to.col = from.col + 2;
                } else {
                  to.row = from.row - 1;
                  to.col = from.col + 1;
                }
              }
              if (to.row > from.row && to.col < from.col && Math.abs(to.row - from.row) === Math.abs(to.col - from.col)) { //bottom left
                if ($scope.board[from.row + 1][from.col - 1] === 'S') {
                  to.row = from.row + 2;
                  to.col = from.col - 2;
                } else {
                  to.row = from.row + 1;
                  to.col = from.col - 1;
                }
              }
              if (to.row > from.row && to.col > from.col && Math.abs(to.row - from.row) === Math.abs(to.col - from.col)) { //bottom right
                if ($scope.board[from.row + 1][from.col + 1] === 'S') {
                  to.row = from.row + 2;
                  to.col = from.col + 2;
                } else {
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
            setDraggingPieceTopLeft({
              top: y - 0.12 * gameArea.clientHeight - size.height / 2,
              left: x - size.width / 2
            });
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
        return {
          top: row * size.height,
          left: col * size.width
        }
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
        $rootScope.$apply(function() {
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


      $scope.countArrivedSheep = function() {
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
        if (playerIndex === 0) { //if it's sheep's turn
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
          if (possibleMoves.length === 1) { //if there is only choice, then choose this one directly
            move = possibleMoves[0];
          } else if (isJump(possibleMoves[0])) { //if the choices are jumps, find the jump which leads to the most subsequent jumps
            var max = 1;
            move = possibleMoves[0];
            for (var i = 0; i < possibleMoves.length; i++) {
              var temp = 1 + jumpNumbers(possibleMoves[i]);
              if (temp > max) {
                max = temp;
                move = possibleMoves[i];
              }
            }
          } else { //only regular moves are available
            var max = 0;
            move = possibleMoves[0];
            for (var i = 0; i < possibleMoves.length; i++) {
              var temp = jumpNumbers(possibleMoves[i]);
              if (temp > max) {
                max = temp;
                move = possibleMoves[i];
              }
            }
            if (max === 0) { //indicates that no move can lead to more jumps
              var maxSheep = 0; //find the move which will be close to the largest number of sheep
              //move = possibleMoves[0];
              for (var i = 0; i < possibleMoves.length; i++) {
                var temp = sheepNumber(possibleMoves[i]);
                if (temp > maxSheep) {
                  maxSheep = temp;
                  move = possibleMoves[i];
                }
              }
              if (maxSheep === 0) { //no move can lead to more sheep
                if (possibleMoves[0][2].set.value.rowBefore < 3) {
                  for (var i = 0; i < possibleMoves.length; i++) {
                    if (possibleMoves[i][2].set.value.rowBefore < possibleMoves[i][2].set.value.rowAfter) {
                      move = possibleMoves[i];
                      break;
                    }
                  }
                } else {
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
        } catch (e) {
          move = possibleMoves[0];
        }
        //console.log("isJump" + isJump(move));
        if (!isJump(move)) {
          isContinue = false;
        } else {
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
        var rowBefore = move[2].set.value.rowBefore;
        var rowAfter = move[2].set.value.rowAfter;
        var colBefore = move[2].set.value.colBefore;
        var colAfter = move[2].set.value.colAfter;
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

      gameService.setGame({
        gameDeveloperEmail: "zangwz@gmail.com",
        minNumberOfPlayers: 2,
        maxNumberOfPlayers: 2,
        isMoveOk: gameLogic.isMoveOk,
        updateUI: updateUI
      });
    }
  ]);
