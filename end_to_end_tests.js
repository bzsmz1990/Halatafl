/**
 * Created by Wenzhao on 3/17/15.
 */


describe('Halatafl', function() {

    'use strict';

    beforeEach(function() {
        browser.get('http://localhost:9000/game.html');
    });

    function getDiv(row, col) {
        return element(by.id('e2e_test_div_' + row + 'x' + col));
    }

    /*function getPiece(row, col, pieceKind) {
        return element(by.id('e2e_test_piece' + pieceKind + '_' + row + 'x' + col));
    }*/


    /*<img id="{{'e2e_test_pieceF_' + row + 'x' + col}}">
     <img id="{{'e2e_test_pieceS_' + row + 'x' + col}}">*/

    function getImg(row, col) {
        return element(by.id('e2e_test_img_' + row + 'x' + col));
    }

    function expectPiece(row, col, pieceKind) {
            //expect(getImg(row, col).isDisplayed()).toEqual(pieceKind === "" ? false : true);
        if (pieceKind == 'F')
        expect(getImg(row, col).getAttribute("src")).toEqual(
                "http://localhost:9000/img/fox.png");
        else if (pieceKind == 'F_trans')
            expect(getImg(row, col).getAttribute("src")).toEqual(
                "http://localhost:9000/img/fox_selected.png");
        else if (pieceKind == 'S')
            expect(getImg(row, col).getAttribute("src")).toEqual(
                "http://localhost:9000/img/sheep.png");
        else if (pieceKind == 'S_trans')
            expect(getImg(row, col).getAttribute("src")).toEqual(
                "http://localhost:9000/img/sheep_selected.png");
        else if (pieceKind == '' || pieceKind == 'X')
            expect(getImg(row, col).getAttribute("src")).toEqual(
                "http://localhost:9000/img/empty.png");
    }


    /*function expectPiece(row, col, pieceKind) {
        // Careful when using animations and asserting isDisplayed:
        // Originally, my animation started from {opacity: 0;}
        // And then the image wasn't displayed.
        // I changed it to start from {opacity: 0.1;}
        expect(getPiece(row, col, 'F').isDisplayed()).toEqual(pieceKind === "F" ? true : false);
        expect(getPiece(row, col, 'S').isDisplayed()).toEqual(pieceKind === "S" ? true : false);
    }*/

    function expectBoard(board) {
        for (var row = 0; row < 7; row++) {
            for (var col = 0; col < 7; col++){
                expectPiece(row, col, board[row][col]);
            }
        }
    }

    function clickDivAndExpectPiece(row, col, pieceKind) {
        getDiv(row, col).click();
        expectPiece(row, col, pieceKind);
    }

    // playMode is either: 'passAndPlay', 'playAgainstTheComputer', 'onlyAIs',
    // or a number representing the playerIndex (-2 for viewer, 0 for white player, 1 for black player, etc)
    function setMatchState(matchState, playMode) {
        browser.executeScript(function(matchStateInJson, playMode) {
            var stateService = window.e2e_test_stateService;
            stateService.setMatchState(angular.fromJson(matchStateInJson));
            stateService.setPlayMode(angular.fromJson(playMode));
            angular.element(document).scope().$apply(); // to tell angular that things changes.
        }, JSON.stringify(matchState), JSON.stringify(playMode));
    }

    it('should have a title', function () {
        expect(browser.getTitle()).toEqual('Halatafl');
    });

    it('should have an initial board', function () {
        expectBoard(
            [['X','X','F', '', 'F','X','X'],
                ['X','X','', '', '','X','X'],
                ['','','','','','',''],
                ['S','S','S','S','S','S','S'],
                ['S','S','S','S','S','S','S'],
                ['X','X','S','S','S','X','X'],
                ['X','X','S','S','S','X','X']]);
    });

    it('should move the fox after clicking twice', function () {
        clickDivAndExpectPiece(3, 1, "S_trans");
        //clickDivAndExpectPiece(0, 2, "F_trans");
        //clickDivAndExpectPiece(1, 2, "");
        clickDivAndExpectPiece(2, 1, "S");
        expectBoard(
            [['X','X','F', '', 'F','X','X'],
                ['X','X','', '', '','X','X'],
                ['','S','','','','',''],
                ['S','','S','S','S','S','S'],
                ['S','S','S','S','S','S','S'],
                ['X','X','S','S','S','X','X'],
                ['X','X','S','S','S','X','X']]);
    });

    it('should ignore the first several clicks', function () {
        clickDivAndExpectPiece(3, 0, "S_trans");
        clickDivAndExpectPiece(3, 1, "S_trans");
        clickDivAndExpectPiece(3, 2, "S_trans");
        clickDivAndExpectPiece(2, 2, "S");
        expectBoard(
            [['X','X','F', '', 'F','X','X'],
                ['X','X','', '', '','X','X'],
                ['','','S','','','',''],
                ['S','S','','S','S','S','S'],
                ['S','S','S','S','S','S','S'],
                ['X','X','S','S','S','X','X'],
                ['X','X','S','S','S','X','X']]);
    });

    /*it('should end game if S wins', function () {
        /*for (var col = 2; col < 5; col++) {
            for (var row = 0; row < 3; row++) {
                clickDivAndExpectPiece(row, col, "S");
            }
            // After the game ends, player "O" click (in cell 2x2) will be ignored.
            //clickDivAndExpectPiece(2, col, col === 2 ? "" : "O");
        }
        clickDivAndExpectPiece(3, 2, "S_trans");
        clickDivAndExpectPiece(2, 2, "S");
        clickDivAndExpectPiece(0, 2, "F_trans");
        clickDivAndExpectPiece(1, 2, "F");
        expectBoard(
            [['X', 'X', 'S', 'S', 'S', 'X', 'X'],
                ['X', 'X', 'S', 'S', 'S', 'X', 'X'],
                ['F', '', 'S', 'S', 'S', '', 'F'],
                ['S', '', '', '', '', '', 'S'],
                ['S', 'S', '', '', '', '', 'S'],
                ['X', 'X', '', '', 'S', 'X', 'X'],
                ['X', 'X', '', '', 'S', 'X', 'X']]);
    });*/


/*
   delta1 = {rowBefore: 1, colBefore: 4, rowAfter: 1, colAfter: 3};
    var board1 =
        [['X', 'X', '', '', 'S', 'X', 'X'],
            ['X', 'X', 'S', 'F', '', 'X', 'X'],
            ['', '', '', 'F', '', '', ''],
            ['S', '', '', 'S', '', '', 'S'],
            ['S', '', '', '', '', 'S', 'S'],
            ['X', 'X', '', '', '', 'X', 'X'],
            ['X', 'X', '', '', 'S', 'X', 'X']];


    var delta3 = {rowBefore: 1, colBefore: 2, rowAfter: 0, colAfter: 2};
    var board3 =
        [['X', 'X', 'S', '', 'S', 'X', 'X'],
            ['X', 'X', '', 'F', '', 'X', 'X'],
            ['', '', '', 'F', '', '', ''],
            ['S', '', '', 'S', '', '', 'S'],
            ['S', '', '', '', '', 'S', 'S'],
            ['X', 'X', '', '', '', 'X', 'X'],
            ['X', 'X', '', '', 'S', 'X', 'X']];
    /*
    var delta3 = {rowBefore: 2, colBefore: 3, rowAfter: 4, colAfter: 3};
    var board3 =
        [['X', 'X', 'S', '', 'S', 'X', 'X'],
            ['X', 'X', '', 'F', '', 'X', 'X'],
            ['', '', '', '', '', '', ''],
            ['S', '', '', '', '', '', 'S'],
            ['S', '', '', 'F', '', 'S', 'S'],
            ['X', 'X', '', '', '', 'X', 'X'],
            ['X', 'X', '', '', 'S', 'X', 'X']];
    /*var delta4 = {row: 2, col: 1};
    var board4 =
        [['X', 'O', ''],
            ['X', 'O', ''],
            ['', 'X', '']];
    */
    /*
    var matchState3 = {
        turnIndexBeforeMove: 0,
        turnIndex: 1,
        endMatchScores:null,
        lastMove: [{setTurn: {turnIndex: 1}},
            {set: {key: 'board', value: board3}},
            {set: {key: 'delta', value: delta3}}],
        lastState: {board: board1, delta: delta1},
        currentState: {board: board3, delta: delta3},
        lastVisibleTo: {},
        currentVisibleTo: {}
    };
    /*
    var matchState3 = {
        turnIndexBeforeMove: 1,
        turnIndex: -2,
        endMatchScores: [0, 1],
        lastMove: [{endMatch: {endMatchScores: [1, 0]}},
            {set: {key: 'board', value: board3}},
            {set: {key: 'delta', value: delta3}}],
        lastState: {board: board2, delta: delta2},
        currentState: {board: board3, delta: delta3},
        lastVisibleTo: {},
        currentVisibleTo: {},
    };
    /*
    var matchState4 = {
        turnIndexBeforeMove: 0,
        turnIndex: 1,
        endMatchScores: null,
        lastMove: [{setTurn: {turnIndex: 1}},
            {set: {key: 'board', value: board4}},
            {set: {key: 'delta', value: delta4}}],
        lastState: {board: board2, delta: delta2},
        currentState: {board: board4, delta: delta4},
        lastVisibleTo: {},
        currentVisibleTo: {},
    };*/



    var delta1 = {rowBefore: 1, colBefore: 4, rowAfter: 1, colAfter: 3};
    var board1 =
        [['X', 'X', '', '', 'S', 'X', 'X'],
            ['X', 'X', 'S', 'F', '', 'X', 'X'],
            ['', '', '', 'F', '', '', ''],
            ['S', '', '', 'S', '', '', 'S'],
            ['S', '', '', '', '', 'S', 'S'],
            ['X', 'X', '', '', '', 'X', 'X'],
            ['X', 'X', '', '', 'S', 'X', 'X']];


    var delta2 = {rowBefore: 1, colBefore: 2, rowAfter: 0, colAfter: 2};
    var board2 =
            [['X', 'X', 'S', '', 'S', 'X', 'X'],
            ['X', 'X', '', 'F', '', 'X', 'X'],
            ['', '', '', 'F', '', '', ''],
            ['S', '', '', 'S', '', '', 'S'],
            ['S', '', '', '', '', 'S', 'S'],
            ['X', 'X', '', '', '', 'X', 'X'],
            ['X', 'X', '', '', 'S', 'X', 'X']];
    var delta3 = {rowBefore: 2, colBefore: 3, rowAfter: 4, colAfter: 3};
    var board3 =
        [['X', 'X', 'S', '', 'S', 'X', 'X'],
            ['X', 'X', '', 'F', '', 'X', 'X'],
            ['', '', '', '', '', '', ''],
            ['S', '', '', '', '', '', 'S'],
            ['S', '', '', 'F', '', 'S', 'S'],
            ['X', 'X', '', '', '', 'X', 'X'],
            ['X', 'X', '', '', 'S', 'X', 'X']];
    /*var delta4 = {row: 2, col: 1};
     var board4 =
     [['X', 'O', ''],
     ['X', 'O', ''],
     ['', 'X', '']];*/

    var matchState2 = {
        turnIndexBeforeMove: 0,
        turnIndex: 1,
        endMatchScores:null,
        lastMove: [{setTurn: {turnIndex: 1}},
            {set: {key: 'board', value: board2}},
            {set: {key: 'delta', value: delta2}}],
        lastState: {board: board1, delta: delta1},
        currentState: {board: board2, delta: delta2},
        lastVisibleTo: {},
        currentVisibleTo: {}
    };
    /*var matchState3 = {
     turnIndexBeforeMove: 1,
     turnIndex: -2,
     endMatchScores: [0, 1],
     lastMove: [{endMatch: {endMatchScores: [1, 0]}},
     {set: {key: 'board', value: board3}},
     {set: {key: 'delta', value: delta3}}],
     lastState: {board: board2, delta: delta2},
     currentState: {board: board3, delta: delta3},
     lastVisibleTo: {},
     currentVisibleTo: {},
     };
     var matchState4 = {
     turnIndexBeforeMove: 0,
     turnIndex: 1,
     endMatchScores: null,
     lastMove: [{setTurn: {turnIndex: 1}},
     {set: {key: 'board', value: board4}},
     {set: {key: 'delta', value: delta4}}],
     lastState: {board: board2, delta: delta2},
     currentState: {board: board4, delta: delta4},
     lastVisibleTo: {},
     currentVisibleTo: {},
     };*/

    it('can start from a match that is about to end, and win', function () {
        setMatchState(matchState2, 'passAndPlay');
        expectBoard(board2);
        clickDivAndExpectPiece(2, 3, "F_trans"); // winning click!
        clickDivAndExpectPiece(4, 3, "F");
        clickDivAndExpectPiece(4, 3, "F"); // can't click after game ended
        expectBoard(board3);
    });

    it('cannot play if it is not your turn', function () {
        // Now make sure that if you're playing "O" (your player index is 1) then
        // you can't do the winning click!
        setMatchState(matchState2, 0); // playMode=1 means that yourPlayerIndex=1.
        expectBoard(board2);
        clickDivAndExpectPiece(2, 3, "F");
        clickDivAndExpectPiece(4, 3, "F"); // can't do the winning click!
        expectBoard(board2);
    });






});
