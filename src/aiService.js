/**
 * Created by Wenzhao on 4/3/15.
 */

angular.module('myApp').factory('aiService',
    ["gameLogic",
        function (gameLogic) {

            'use strict';

            function createComputerMove(board, playerIndex) {
                var possibleMoves = gameLogic.getPossibleMoves(board, playerIndex);
                if (playerIndex === 0) {  //if it's sheep's turn
                    if (possibleMoves.length !== 0) {
                        var randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
                        return randomMove;
                    }
                }
                //if it's fox's turn
                if (possibleMoves.length === 1) {   //if there is only choice, then choose this one directly
                    return possibleMoves[0];
                }
                if (isJump(possibleMoves[0])) {   //if the choices are jumps, find the jump which leads to the most subsequent jumps
                    var max = 1;
                    var move = possibleMoves[0];
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
                    var move = possibleMoves[0];
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
                return move;
            }

            function jumpNumbers(move) {
                var possibleMoves = gameLogic.getPossibleMoves(move[1].set.value, 1);
                if (!isJump(possibleMoves[0])) return 0;
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
                    var count = 0;
                    for (var i = -1; i < 2; i++) {
                        for (var j = -1; j < 2; j++) {
                            if (i === 0 && j === 0) continue;
                            if (board[row + i][col + j] === 'S')
                            count++;
                        }
                    }
                    return count;
                }

            return {createComputerMove: createComputerMove};
        }]);
