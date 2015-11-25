/**
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
