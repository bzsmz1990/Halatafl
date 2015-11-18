/**
 * Created by Wenzhao on 4/3/15.
 */

module aiService {
  var isContinue = false;
  var currentRow = 0;
  var currentCol = 0;


  export function createComputerMove(board: Board, playerIndex: number) {
    var possibleMoves = gameLogic.getPossibleMoves(board, playerIndex);
    if (playerIndex === 0) {  //if it's sheep's turn
      if (possibleMoves.length !== 0) {
        var randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
        return randomMove;
      }
    }

    var move: IMove;
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
                { move = possibleMoves[i]; break; }
              }
            }
            else {
              for (var i = 0; i < possibleMoves.length; i++) {
                if (possibleMoves[i][2].set.value.rowBefore > possibleMoves[i][2].set.value.rowAfter)
                { move = possibleMoves[i]; break; }
              }
            }

          }

        }

      }
    } catch (e) {
      move = possibleMoves[0];
    }
    //console.log("isJump" + isJump(move));
    if (!isJump(move)) { isContinue = false; }
    else {
      var tempMoves = gameLogic.getPossibleMoves(move[1].set.value, 1);
      var i: number;
      for (i = 0; i < tempMoves.length; i++) {
        if (isJump(tempMoves[i]) && tempMoves[i][2].set.value.rowBefore === move[2].set.value.rowAfter && tempMoves[i][2].set.value.colBefore === move[2].set.value.colAfter) {
          isContinue = true;
          currentRow = move[2].set.value.rowAfter;
          currentCol = move[2].set.value.colAfter;
          break;
        }
      }
      console.log("i is " + i);
      if (i === tempMoves.length) { isContinue = false; }
    }
    return move;
  }

  function jumpNumbers(move: IMove) {
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

  function isJump(move: IMove) {
    var rowBefore = move[2].set.value.rowBefore;
    var rowAfter = move[2].set.value.rowAfter;
    var colBefore = move[2].set.value.colBefore;
    var colAfter = move[2].set.value.colAfter;
    if (Math.abs(rowBefore - rowAfter) === 2 || Math.abs(colBefore - colAfter) === 2)
      return true;
    else return false;
  }

  function sheepNumber(move: IMove) {
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
}


angular.module('myApp', ['ngTouch', 'ui.bootstrap', 'gameServices'])
  .factory('aiService', function() {
  return {
    createComputerMove: aiService.createComputerMove
  };
});
