/**
 * Created by Zhizheng Pan on 2/28/15.
 */
describe("Halatafl", function() {
    var _gameLogic;

    beforeEach(module("myApp"));

    beforeEach(inject(function (gameLogic) {
        _gameLogic = gameLogic;
    }));

    function expectMoveOk(turnIndexBeforeMove, stateBeforeMove, move) {
        expect(_gameLogic.isMoveOk({
            turnIndexBeforeMove: turnIndexBeforeMove,
            stateBeforeMove: stateBeforeMove,
            move: move
        })).toBe(true);
    }

    function expectIllegalMove(turnIndexBeforeMove, stateBeforeMove, move) {
        expect(_gameLogic.isMoveOk({
            turnIndexBeforeMove: turnIndexBeforeMove,
            stateBeforeMove: stateBeforeMove,
            move: move
        })).toBe(false);
    }


    it("initially moving the sheep from (3,0) to (2,0) is legal", function () {
        expectMoveOk(0, {},
            [{setTurn: {turnIndex: 1}},
                {
                    set: {
                        key: 'board', value: [['X', 'X', 'F', '', 'F', 'X', 'X'],
                            ['X', 'X', '', '', '', 'X', 'X'],
                            ['S', '', '', '', '', '', ''],
                            ['', 'S', 'S', 'S', 'S', 'S', 'S'],
                            ['S', 'S', 'S', 'S', 'S', 'S', 'S'],
                            ['X', 'X', 'S', 'S', 'S', 'X', 'X'],
                            ['X', 'X', 'S', 'S', 'S', 'X', 'X']]
                    }
                },
                {set: {key: 'delta', value: {rowBefore: 3, colBefore: 0, rowAfter: 2, colAfter: 0}}}]);
    });




    it("moving the sheep backward with teleportation from (2,3) to (3,6) is illegal", function () {
        expectIllegalMove(0, {board:[['X', 'X', '', '', '', 'X', 'X'],
                ['X', 'X', 'F', '', 'F', 'X', 'X'],
                ['', '', '', 'S', '', '', 'S'],
                ['S', 'S', '', 'S', 'S', 'S', ''],
                ['S', 'S', 'S', 'S', 'S', 'S', 'S'],
                ['X', 'X', 'S', 'S', 'S', 'X', 'X'],
                ['X', 'X', 'S', 'S', 'S', 'X', 'X']],delta:{rowBefore: 0, colBefore: 4, rowAfter: 1, colAfter: 4}},
            [{setTurn: {turnIndex: 1}},
                {
                    set: {
                        key: 'board', value: [['X', 'X', '', '', '', 'X', 'X'],
                            ['X', 'X', 'F', '', 'F', 'X', 'X'],
                            ['', '', '', '', '', '', 'S'],
                            ['S', 'S', '', 'S', 'S', 'S', 'S'],
                            ['S', 'S', 'S', 'S', 'S', 'S', 'S'],
                            ['X', 'X', 'S', 'S', 'S', 'X', 'X'],
                            ['X', 'X', 'S', 'S', 'S', 'X', 'X']]
                    }
                },
                {set: {key: 'delta', value: {rowBefore: 2, colBefore: 3, rowAfter: 3, colAfter: 6}}}]);
    });




    it("after moving fox from (5,4) to (6,4) , the fox makes a jump right after that, which is illegel", function () {
        expectIllegalMove(1, {board:[['X', 'X', '', '', 'S', 'X', 'X'],
                ['X', 'X', '', 'F', '', 'X', 'X'],
                ['', 'S', '', '', 'S', '', 'S'],
                ['S', '', '', 'S', '', 'S', 'S'],
                ['', 'S', 'S', '', '', '', 'S'],
                ['X', 'X', 'S', '', '', 'X', 'X'],
                ['X', 'X', '', 'S', 'F', 'X', 'X']],delta:{rowBefore: 5, colBefore: 4, rowAfter: 6, colAfter: 4}},
            [{setTurn: {turnIndex: 1}},
                {
                    set: {
                        key: 'board', value: [['X', 'X', '', '', 'S', 'X', 'X'],
                            ['X', 'X', '', 'F', '', 'X', 'X'],
                            ['', 'S', '', '', 'S', '', 'S'],
                            ['S', '', '', 'S', '', 'S', 'S'],
                            ['', 'S', 'S', '', '', '', 'S'],
                            ['X', 'X', 'S', '', '', 'X', 'X'],
                            ['X', 'X', 'F', '', '', 'X', 'X']]
                    }
                },
                {set: {key: 'delta', value: {rowBefore: 6, colBefore: 4, rowAfter: 6, colAfter: 2}}}]);


    });



    it("moving the fox from (0,4) to (1,4) and kill sheep in (2,0),(3,1) and (4,1) without a jump is illegal", function () {
        expectIllegalMove(1, {board:[['X', 'X', 'F', '', 'F', 'X', 'X'],
            ['X', 'X', '', '', '', 'X', 'X'],
            ['S', '', '', '', '', '', ''],
            ['', 'S', 'S', 'S', 'S', 'S', 'S'],
            ['S', 'S', 'S', 'S', 'S', 'S', 'S'],
            ['X', 'X', 'S', 'S', 'S', 'X', 'X'],
            ['X', 'X', 'S', 'S', 'S', 'X', 'X']],delta:{rowBefore: 3, colBefore: 0, rowAfter: 2, colAfter: 0}},
            [{setTurn: {turnIndex: 0}},
                {
                    set: {
                        key: 'board', value: [['X', 'X', 'F', '', '', 'X', 'X'],
                            ['X', 'X', '', '', 'F', 'X', 'X'],
                            ['', '', '', '', '', '', ''],
                            ['', '', 'S', 'S', 'S', 'S', 'S'],
                            ['S', '', 'S', 'S', 'S', 'S', 'S'],
                            ['X', 'X', '', 'S', 'S', 'X', 'X'],
                            ['X', 'X', 'S', 'S', 'S', 'X', 'X']]
                    }
                },
                {set: {key: 'delta', value: {rowBefore: 0, colBefore: 4, rowAfter: 1, colAfter: 4}}}]);
    });     // bug detected





});
