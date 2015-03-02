/**
 * Created by Wenzhao on 2/22/15.
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


    it("moving the sheep from initial state is legal", function () {
        expectMoveOk(0, {},
            [{setTurn: {turnIndex: 1}},
                {
                    set: {
                        key: 'board', value: [['X', 'X', 'F', '', 'F', 'X', 'X'],
                            ['X', 'X', '', '', '', 'X', 'X'],
                            ['', '', 'S', '', '', '', ''],
                            ['S', 'S', '', 'S', 'S', 'S', 'S'],
                            ['S', 'S', 'S', 'S', 'S', 'S', 'S'],
                            ['X', 'X', 'S', 'S', 'S', 'X', 'X'],
                            ['X', 'X', 'S', 'S', 'S', 'X', 'X']]
                    }
                },
                {set: {key: 'delta', value: {rowBefore: 3, colBefore: 2, rowAfter: 2, colAfter: 2}}}]);
    });


    it("moving the fox from initial state is legal", function () {
        expectMoveOk(1, {board:[['X', 'X', 'F', '', 'F', 'X', 'X'],
            ['X', 'X', '', '', '', 'X', 'X'],
            ['', '', 'S', '', '', '', ''],
            ['S', 'S', '', 'S', 'S', 'S', 'S'],
            ['S', 'S', 'S', 'S', 'S', 'S', 'S'],
            ['X', 'X', 'S', 'S', 'S', 'X', 'X'],
            ['X', 'X', 'S', 'S', 'S', 'X', 'X']],delta:{rowBefore: 3, colBefore: 2, rowAfter: 2, colAfter: 2}},
            [{setTurn: {turnIndex: 0}},
                {
                    set: {
                        key: 'board', value: [['X', 'X', '', '', 'F', 'X', 'X'],
                            ['X', 'X', 'F', '', '', 'X', 'X'],
                            ['', '', 'S', '', '', '', ''],
                            ['S', 'S', '', 'S', 'S', 'S', 'S'],
                            ['S', 'S', 'S', 'S', 'S', 'S', 'S'],
                            ['X', 'X', 'S', 'S', 'S', 'X', 'X'],
                            ['X', 'X', 'S', 'S', 'S', 'X', 'X']]
                    }
                },
                {set: {key: 'delta', value: {rowBefore: 0, colBefore: 2, rowAfter: 1, colAfter: 2}}}]);
    });


    it("moving fox when it's sheep's turn is illegal", function () {
        expectIllegalMove(0, {board:[['X', 'X', '', '', 'F', 'X', 'X'],
                ['X', 'X', '', 'F', '', 'X', 'X'],
                ['', '', 'S', '', '', '', ''],
                ['S', 'S', '', 'S', 'S', 'S', 'S'],
                ['S', 'S', 'S', 'S', 'S', 'S', 'S'],
                ['X', 'X', 'S', 'S', 'S', 'X', 'X'],
                ['X', 'X', 'S', 'S', 'S', 'X', 'X']],delta:{rowBefore: 0, colBefore: 2, rowAfter: 1, colAfter: 3}},
            [{setTurn: {turnIndex: 1}},
                {
                    set: {
                        key: 'board', value: [['X', 'X', '', '', 'F', 'X', 'X'],
                            ['X', 'X', '', '', '', 'X', 'X'],
                            ['', '', 'S', '', 'F', '', ''],
                            ['S', 'S', '', 'S', 'S', 'S', 'S'],
                            ['S', 'S', 'S', 'S', 'S', 'S', 'S'],
                            ['X', 'X', 'S', 'S', 'S', 'X', 'X'],
                            ['X', 'X', 'S', 'S', 'S', 'X', 'X']]
                    }
                },
                {set: {key: 'delta', value: {rowBefore: 1, colBefore: 3, rowAfter: 2, colAfter: 4}}}]);
    });




    it("moving sheep when it's fox's turn is illegal", function () {
        expectIllegalMove(1, {board:[['X', 'X', '', '', 'F', 'X', 'X'],
                ['X', 'X', '', 'F', '', 'X', 'X'],
                ['', '', '', 'S', '', '', ''],
                ['S', 'S', '', 'S', 'S', 'S', 'S'],
                ['S', 'S', 'S', 'S', 'S', 'S', 'S'],
                ['X', 'X', 'S', 'S', 'S', 'X', 'X'],
                ['X', 'X', 'S', 'S', 'S', 'X', 'X']],delta:{rowBefore: 2, colBefore: 2, rowAfter: 2, colAfter: 3}},
            [{setTurn: {turnIndex: 0}},
                {
                    set: {
                        key: 'board', value: [['X', 'X', '', '', 'F', 'X', 'X'],
                            ['X', 'X', '', 'F', '', 'X', 'X'],
                            ['', '', '', '', 'S', '', ''],
                            ['S', 'S', '', 'S', 'S', 'S', 'S'],
                            ['S', 'S', 'S', 'S', 'S', 'S', 'S'],
                            ['X', 'X', 'S', 'S', 'S', 'X', 'X'],
                            ['X', 'X', 'S', 'S', 'S', 'X', 'X']]
                    }
                },
                {set: {key: 'delta', value: {rowBefore: 2, colBefore: 3, rowAfter: 2, colAfter: 4}}}]);
    });


    it("moving a fox to a non-existent vertex is illegal", function () {
        expectIllegalMove(1, {board:[['X', 'X', '', '', 'F', 'X', 'X'],
                ['X', 'X', '', 'F', '', 'X', 'X'],
                ['', '', '', 'S', '', '', ''],
                ['S', 'S', '', 'S', 'S', 'S', 'S'],
                ['S', 'S', 'S', 'S', 'S', 'S', 'S'],
                ['X', 'X', 'S', 'S', 'S', 'X', 'X'],
                ['X', 'X', 'S', 'S', 'S', 'X', 'X']],delta:{rowBefore: 2, colBefore: 2, rowAfter: 2, colAfter: 3}},
            [{setTurn: {turnIndex: 0}},
                {
                    set: {
                        key: 'board', value: [['X', 'X', '', '', '', 'F', 'X'],
                            ['X', 'X', '', 'F', '', 'X', 'X'],
                            ['', '', '', 'S', '', '', ''],
                            ['S', 'S', '', 'S', 'S', 'S', 'S'],
                            ['S', 'S', 'S', 'S', 'S', 'S', 'S'],
                            ['X', 'X', 'S', 'S', 'S', 'X', 'X'],
                            ['X', 'X', 'S', 'S', 'S', 'X', 'X']]
                    }
                },
                {set: {key: 'delta', value: {rowBefore: 0, colBefore: 4, rowAfter: 0, colAfter: 5}}}]);
    });




    it("moving a sheep to a non-existent vertex is illegal", function () {
        expectIllegalMove(0, {board:[['X', 'X', '', 'F', '', 'X', 'X'],
                ['X', 'X', '', 'F', '', 'X', 'X'],
                ['', 'S', '', '', '', '', ''],
                ['S', 'S', '', 'S', 'S', 'S', 'S'],
                ['S', 'S', 'S', 'S', 'S', 'S', 'S'],
                ['X', 'X', 'S', 'S', 'S', 'X', 'X'],
                ['X', 'X', 'S', 'S', 'S', 'X', 'X']],delta:{rowBefore: 0, colBefore: 4, rowAfter: 0, colAfter: 3}},
            [{setTurn: {turnIndex: 1}},
                {
                    set: {
                        key: 'board', value: [['X', 'X', '', '', '', 'F', 'X'],
                            ['X', 'S', '', 'F', '', 'X', 'X'],
                            ['', '', '', '', '', '', ''],
                            ['S', 'S', '', 'S', 'S', 'S', 'S'],
                            ['S', 'S', 'S', 'S', 'S', 'S', 'S'],
                            ['X', 'X', 'S', 'S', 'S', 'X', 'X'],
                            ['X', 'X', 'S', 'S', 'S', 'X', 'X']]
                    }
                },
                {set: {key: 'delta', value: {rowBefore: 2, colBefore: 1, rowAfter: 1, colAfter: 1}}}]);
    });




    it("moving the sheep backward is illegal", function () {
        expectIllegalMove(0, {board:[['X', 'X', '', '', '', 'X', 'X'],
                ['X', 'X', 'F', '', 'F', 'X', 'X'],
                ['', 'S', '', 'S', '', '', ''],
                ['S', '', '', 'S', 'S', 'S', 'S'],
                ['S', 'S', 'S', 'S', 'S', 'S', 'S'],
                ['X', 'X', 'S', 'S', 'S', 'X', 'X'],
                ['X', 'X', 'S', 'S', 'S', 'X', 'X']],delta:{rowBefore: 0, colBefore: 4, rowAfter: 1, colAfter: 4}},
            [{setTurn: {turnIndex: 1}},
                {
                    set: {
                        key: 'board', value: [['X', 'X', '', '', '', 'X', 'X'],
                            ['X', 'X', 'F', '', 'F', 'X', 'X'],
                            ['', '', '', 'S', '', '', ''],
                            ['S', 'S', '', 'S', 'S', 'S', 'S'],
                            ['S', 'S', 'S', 'S', 'S', 'S', 'S'],
                            ['X', 'X', 'S', 'S', 'S', 'X', 'X'],
                            ['X', 'X', 'S', 'S', 'S', 'X', 'X']]
                    }
                },
                {set: {key: 'delta', value: {rowBefore: 2, colBefore: 1, rowAfter: 3, colAfter: 1}}}]);
    });



    it("moving sheep diagonally is illegal", function () {
        expectIllegalMove(0, {board:[['X', 'X', '', '', '', 'X', 'X'],
                ['X', 'X', 'F', '', 'F', 'X', 'X'],
                ['', 'S', '', 'S', '', '', ''],
                ['S', '', '', 'S', 'S', 'S', 'S'],
                ['S', 'S', 'S', 'S', 'S', 'S', 'S'],
                ['X', 'X', 'S', 'S', 'S', 'X', 'X'],
                ['X', 'X', 'S', 'S', 'S', 'X', 'X']],delta:{rowBefore: 0, colBefore: 4, rowAfter: 1, colAfter: 4}},
            [{setTurn: {turnIndex: 1}},
                {
                    set: {
                        key: 'board', value: [['X', 'X', '', '', '', 'X', 'X'],
                            ['X', 'X', 'F', '', 'F', 'X', 'X'],
                            ['', 'S', 'S', 'S', '', '', ''],
                            ['S', '', '', '', 'S', 'S', 'S'],
                            ['S', 'S', 'S', 'S', 'S', 'S', 'S'],
                            ['X', 'X', 'S', 'S', 'S', 'X', 'X'],
                            ['X', 'X', 'S', 'S', 'S', 'X', 'X']]
                    }
                },
                {set: {key: 'delta', value: {rowBefore: 3, colBefore: 3, rowAfter: 2, colAfter: 2}}}]);
    });


    it("when jump opportunity exists, making this jump is legal", function () {
        expectMoveOk(1, {board:[['X', 'X', '', '', '', 'X', 'X'],
                ['X', 'X', 'F', '', 'F', 'X', 'X'],
                ['', 'S', 'S', '', '', '', ''],
                ['S', '', '', 'S', 'S', 'S', 'S'],
                ['S', 'S', 'S', 'S', 'S', 'S', 'S'],
                ['X', 'X', 'S', 'S', 'S', 'X', 'X'],
                ['X', 'X', 'S', 'S', 'S', 'X', 'X']],delta:{rowBefore: 2, colBefore: 3, rowAfter: 2, colAfter: 2}},
            [{setTurn: {turnIndex: 0}},
                {
                    set: {
                        key: 'board', value: [['X', 'X', '', '', '', 'X', 'X'],
                            ['X', 'X', '', '', 'F', 'X', 'X'],
                            ['', 'S', '', '', '', '', ''],
                            ['S', '', 'F', 'S', 'S', 'S', 'S'],
                            ['S', 'S', 'S', 'S', 'S', 'S', 'S'],
                            ['X', 'X', 'S', 'S', 'S', 'X', 'X'],
                            ['X', 'X', 'S', 'S', 'S', 'X', 'X']]
                    }
                },
                {set: {key: 'delta', value: {rowBefore: 1, colBefore: 2, rowAfter: 3, colAfter: 2}}}]);
    });


    it("when jump opportunity exists, other moves for this fox are illegal", function () {
        expectIllegalMove(1, {board:[['X', 'X', '', '', '', 'X', 'X'],
                ['X', 'X', 'F', '', 'F', 'X', 'X'],
                ['', 'S', 'S', '', '', '', ''],
                ['S', '', '', 'S', 'S', 'S', 'S'],
                ['S', 'S', 'S', 'S', 'S', 'S', 'S'],
                ['X', 'X', 'S', 'S', 'S', 'X', 'X'],
                ['X', 'X', 'S', 'S', 'S', 'X', 'X']],delta:{rowBefore: 2, colBefore: 3, rowAfter: 2, colAfter: 2}},
            [{setTurn: {turnIndex: 0}},
                {
                    set: {
                        key: 'board', value: [['X', 'X', 'F', '', '', 'X', 'X'],
                            ['X', 'X', '', '', 'F', 'X', 'X'],
                            ['', 'S', 'S', '', '', '', ''],
                            ['S', '', '', 'S', 'S', 'S', 'S'],
                            ['S', 'S', 'S', 'S', 'S', 'S', 'S'],
                            ['X', 'X', 'S', 'S', 'S', 'X', 'X'],
                            ['X', 'X', 'S', 'S', 'S', 'X', 'X']]
                    }
                },
                {set: {key: 'delta', value: {rowBefore: 1, colBefore: 2, rowAfter: 0, colAfter: 2}}}]);
    });



    it("when one fox has jump opportunity, moving the other fox without is illegal", function () {
        expectIllegalMove(1, {board:[['X', 'X', '', '', '', 'X', 'X'],
                ['X', 'X', 'F', '', 'F', 'X', 'X'],
                ['', 'S', 'S', '', '', '', ''],
                ['S', '', '', 'S', 'S', 'S', 'S'],
                ['S', 'S', 'S', 'S', 'S', 'S', 'S'],
                ['X', 'X', 'S', 'S', 'S', 'X', 'X'],
                ['X', 'X', 'S', 'S', 'S', 'X', 'X']],delta:{rowBefore: 2, colBefore: 3, rowAfter: 2, colAfter: 2}},
            [{setTurn: {turnIndex: 0}},
                {
                    set: {
                        key: 'board', value: [['X', 'X', '', '', 'F', 'X', 'X'],
                            ['X', 'X', 'F', '', '', 'X', 'X'],
                            ['', 'S', 'S', '', '', '', ''],
                            ['S', '', '', 'S', 'S', 'S', 'S'],
                            ['S', 'S', 'S', 'S', 'S', 'S', 'S'],
                            ['X', 'X', 'S', 'S', 'S', 'X', 'X'],
                            ['X', 'X', 'S', 'S', 'S', 'X', 'X']]
                    }
                },
                {set: {key: 'delta', value: {rowBefore: 1, colBefore: 4, rowAfter: 0, colAfter: 4}}}]);
    });


    it("fox winning is legal", function () {
        expectMoveOk(1, {board:[['X', 'X', 'S', '', 'S', 'X', 'X'],
                ['X', 'X', '', 'F', '', 'X', 'X'],
                ['', '', '', 'F', '', '', ''],
                ['S', '', '', 'S', '', '', 'S'],
                ['S', '', '', '', '', 'S', 'S'],
                ['X', 'X', '', '', '', 'X', 'X'],
                ['X', 'X', '', '', 'S', 'X', 'X']],delta:{rowBefore: 1, colBefore: 2, rowAfter: 0, colAfter: 2}},
            [{endMatch: {endMatchScores: [0,1]}},
                {
                    set: {
                        key: 'board', value: [['X', 'X', 'S', '', 'S', 'X', 'X'],
                            ['X', 'X', '', 'F', '', 'X', 'X'],
                            ['', '', '', '', '', '', ''],
                            ['S', '', '', '', '', '', 'S'],
                            ['S', '', '', 'F', '', 'S', 'S'],
                            ['X', 'X', '', '', '', 'X', 'X'],
                            ['X', 'X', '', '', 'S', 'X', 'X']]
                    }
                },
                {set: {key: 'delta', value: {rowBefore: 2, colBefore: 3, rowAfter: 4, colAfter: 3}}}]);
    });


    it("sheep winning is legal", function () {
        expectMoveOk(0, {board:[['X', 'X', 'S', 'S', 'S', 'X', 'X'],
                ['X', 'X', 'S', 'S', 'S', 'X', 'X'],
                ['F', '', 'S', 'S', '', '', 'F'],
                ['S', '', '', '', 'S', '', 'S'],
                ['S', 'S', '', '', '', '', 'S'],
                ['X', 'X', '', '', 'S', 'X', 'X'],
                ['X', 'X', '', '', 'S', 'X', 'X']],delta:{rowBefore: 4, colBefore: 4, rowAfter: 2, colAfter: 6}},
            [{endMatch: {endMatchScores: [1,0]}},
                {
                    set: {
                        key: 'board', value: [['X', 'X', 'S', 'S', 'S', 'X', 'X'],
                            ['X', 'X', 'S', 'S', 'S', 'X', 'X'],
                            ['F', '', 'S', 'S', 'S', '', 'F'],
                            ['S', '', '', '', '', '', 'S'],
                            ['S', 'S', '', '', '', '', 'S'],
                            ['X', 'X', '', '', 'S', 'X', 'X'],
                            ['X', 'X', '', '', 'S', 'X', 'X']]
                    }
                },
                {set: {key: 'delta', value: {rowBefore: 3, colBefore: 4, rowAfter: 2, colAfter: 4}}}]);
    });


    it("null move is illegal", function() {
        expectIllegalMove(0, {}, null);
    });


    it("move without board is illegal", function() {
        expectIllegalMove(0, {}, [{setTurn: {turnIndex : 1}}]);
    });


    it("moving without delta is illegal", function() {
        expectIllegalMove(0, {}, [{setTurn: {turnIndex : 1}},
            {set: {key: 'board', value:
                [['X', 'X', '', '', 'F', 'X', 'X'],
                    ['X', 'X', '', 'F', '', 'X', 'X'],
                    ['', '', 'S', '', '', '', ''],
                    ['S', 'S', '', 'S', 'S', 'S', 'S'],
                    ['S', 'S', 'S', 'S', 'S', 'S', 'S'],
                    ['X', 'X', 'S', 'S', 'S', 'X', 'X'],
                    ['X', 'X', 'S', 'S', 'S', 'X', 'X']]}}]);
    });


    it("when sheep is winner, any move is illegal", function () {
        expectIllegalMove(1, {board:[['X', 'X', 'S', 'S', 'S', 'X', 'X'],
                ['X', 'X', 'S', 'S', 'S', 'X', 'X'],
                ['F', '', 'S', 'S', 'S', '', 'F'],
                ['S', '', '', '', '', '', 'S'],
                ['S', 'S', '', '', '', '', 'S'],
                ['X', 'X', '', '', 'S', 'X', 'X'],
                ['X', 'X', '', '', 'S', 'X', 'X']],delta:{rowBefore: 3, colBefore: 4, rowAfter: 2, colAfter: 4}},
            [{setTurn: {turnIndex: 0}},
                {
                    set: {
                        key: 'board', value: [['X', 'X', 'S', 'S', 'S', 'X', 'X'],
                            ['X', 'X', 'S', 'S', 'S', 'X', 'X'],
                            ['', 'F', 'S', 'S', 'S', '', 'F'],
                            ['S', '', '', '', '', '', 'S'],
                            ['S', 'S', '', '', '', '', 'S'],
                            ['X', 'X', '', '', 'S', 'X', 'X'],
                            ['X', 'X', '', '', 'S', 'X', 'X']]
                    }
                },
                {set: {key: 'delta', value: {rowBefore: 2, colBefore: 0, rowAfter: 2, colAfter: 1}}}]);
    });

    it("when fox is winner, any move is illegal", function () {
        expectIllegalMove(0, {board:[['X', 'X', 'S', '', 'S', 'X', 'X'],
                ['X', 'X', '', 'F', '', 'X', 'X'],
                ['', '', '', '', '', '', ''],
                ['S', '', '', '', '', '', 'S'],
                ['S', '', '', 'F', '', 'S', 'S'],
                ['X', 'X', '', '', '', 'X', 'X'],
                ['X', 'X', '', '', 'S', 'X', 'X']],delta:{rowBefore: 2, colBefore: 3, rowAfter: 4, colAfter: 3}},
            [{setTurn: {turnIndex: 1}},
                {
                    set: {
                        key: 'board', value: [['X', 'X', '', 'S', 'S', 'X', 'X'],
                            ['X', 'X', '', 'F', '', 'X', 'X'],
                            ['', '', '', '', '', '', ''],
                            ['S', '', '', '', '', '', 'S'],
                            ['S', '', '', 'F', '', 'S', 'S'],
                            ['X', 'X', '', '', '', 'X', 'X'],
                            ['X', 'X', '', '', 'S', 'X', 'X']]
                    }
                },
                {set: {key: 'delta', value: {rowBefore: 0, colBefore: 2, rowAfter: 0, colAfter: 3}}}]);
    });


    it("moving fox to an occupied vertex is illegal", function () {
        expectIllegalMove(1, {board:[['X', 'X', '', '', 'F', 'X', 'X'],
                ['X', 'X', '', 'F', '', 'X', 'X'],
                ['', '', '', 'S', '', '', ''],
                ['S', 'S', '', 'S', 'S', 'S', 'S'],
                ['S', 'S', 'S', 'S', 'S', 'S', 'S'],
                ['X', 'X', 'S', 'S', 'S', 'X', 'X'],
                ['X', 'X', 'S', 'S', 'S', 'X', 'X']],delta:{rowBefore: 2, colBefore: 2, rowAfter: 2, colAfter: 3}},
            [{setTurn: {turnIndex: 0}},
                {
                    set: {
                        key: 'board', value: [['X', 'X', '', '', '', 'X', 'X'],
                            ['X', 'X', '', 'F', '', 'X', 'X'],
                            ['', '', '', 'S', '', '', ''],
                            ['S', 'S', '', 'S', 'S', 'S', 'S'],
                            ['S', 'S', 'S', 'S', 'S', 'S', 'S'],
                            ['X', 'X', 'S', 'S', 'S', 'X', 'X'],
                            ['X', 'X', 'S', 'S', 'S', 'X', 'X']]
                    }
                },
                {set: {key: 'delta', value: {rowBefore: 0, colBefore: 4, rowAfter: 1, colAfter: 3}}}]);
    });


    it("moving sheep to an occupied vertex is illegal", function () {
        expectIllegalMove(0, {board:[['X', 'X', '', 'F', '', 'X', 'X'],
                ['X', 'X', '', 'F', '', 'X', 'X'],
                ['', '', '', 'S', '', '', ''],
                ['S', 'S', '', 'S', 'S', 'S', 'S'],
                ['S', 'S', 'S', 'S', 'S', 'S', 'S'],
                ['X', 'X', 'S', 'S', 'S', 'X', 'X'],
                ['X', 'X', 'S', 'S', 'S', 'X', 'X']],delta:{rowBefore: 0, colBefore: 4, rowAfter: 0, colAfter: 3}},
            [{setTurn: {turnIndex: 1}},
                {
                    set: {
                        key: 'board', value: [['X', 'X', '', 'F', '', 'X', 'X'],
                            ['X', 'X', '', 'S', '', 'X', 'X'],
                            ['', '', '', '', '', '', ''],
                            ['S', 'S', '', 'S', 'S', 'S', 'S'],
                            ['S', 'S', 'S', 'S', 'S', 'S', 'S'],
                            ['X', 'X', 'S', 'S', 'S', 'X', 'X'],
                            ['X', 'X', 'S', 'S', 'S', 'X', 'X']]
                    }
                },
                {set: {key: 'delta', value: {rowBefore: 2, colBefore: 3, rowAfter: 1, colAfter: 3}}}]);
    });

    it("moving fox diagonally when no such path exists is illegal", function () {
        expectIllegalMove(1, {board:[['X', 'X', '', 'F', '', 'X', 'X'],
                ['X', 'X', '', 'F', '', 'X', 'X'],
                ['', '', '', 'S', '', '', ''],
                ['S', 'S', 'S', 'S', 'S', 'S', 'S'],
                ['S', 'S', '', 'S', 'S', 'S', 'S'],
                ['X', 'X', 'S', 'S', 'S', 'X', 'X'],
                ['X', 'X', 'S', 'S', 'S', 'X', 'X']],delta:{rowBefore: 4, colBefore: 2, rowAfter: 3, colAfter: 2}},
            [{setTurn: {turnIndex: 0}},
                {
                    set: {
                        key: 'board', value: [['X', 'X', '', '', '', 'X', 'X'],
                            ['X', 'X', '', 'F', 'F', 'X', 'X'],
                            ['', '', '', 'S', '', '', ''],
                            ['S', 'S', '', 'S', 'S', 'S', 'S'],
                            ['S', 'S', 'S', 'S', 'S', 'S', 'S'],
                            ['X', 'X', 'S', 'S', 'S', 'X', 'X'],
                            ['X', 'X', 'S', 'S', 'S', 'X', 'X']]
                    }
                },
                {set: {key: 'delta', value: {rowBefore: 0, colBefore: 3, rowAfter: 1, colAfter: 4}}}]);
    });

    it("getPossibleMoves returns exactly one move, which is the jump opportunity", function() {
        var board =
            [['X', 'X', '', '', '', 'X', 'X'],
                ['X', 'X', 'F', '', 'F', 'X', 'X'],
                ['', 'S', 'S', '', '', '', ''],
                ['S', '', '', 'S', 'S', 'S', 'S'],
                ['S', 'S', 'S', 'S', 'S', 'S', 'S'],
                ['X', 'X', 'S', 'S', 'S', 'X', 'X'],
                ['X', 'X', 'S', 'S', 'S', 'X', 'X']];
        var possibleMoves = _gameLogic.getPossibleMoves(board, 1);
        var expectedMove = [{setTurn: {turnIndex: 0}},
            {set: {key: 'board', value:
                [['X', 'X', '', '', '', 'X', 'X'],
                    ['X', 'X', '', '', 'F', 'X', 'X'],
                    ['', 'S', '', '', '', '', ''],
                    ['S', '', 'F', 'S', 'S', 'S', 'S'],
                    ['S', 'S', 'S', 'S', 'S', 'S', 'S'],
                    ['X', 'X', 'S', 'S', 'S', 'X', 'X'],
                    ['X', 'X', 'S', 'S', 'S', 'X', 'X']]}},
            {set: {key: 'delta', value: {rowBefore: 1, colBefore: 2, rowAfter: 3, colAfter: 2}}}];
        expect(possibleMoves.board === [expectedMove].board).toBe(true);
    });



    it("getPossibleMoves returns exactly one move, which is the sheep's move", function() {
        var board =
            [['X', 'X', 'S', 'S', 'S', 'X', 'X'],
                ['X', 'X', 'S', 'S', 'S', 'X', 'X'],
                ['', '', 'S', '', 'S', '', ''],
                ['', '', 'F', 'S', 'F', '', ''],
                ['', '', '', '', '', '', ''],
                ['X', 'X', '', '', '', 'X', 'X'],
                ['X', 'X', '', '', '', 'X', 'X']];
        var possibleMoves = _gameLogic.getPossibleMoves(board, 0);
        var expectedMove = [{endMatch: {endMatchScores: [1,0]}},
            {set: {key: 'board', value:
                [['X', 'X', 'S', 'S', 'S', 'X', 'X'],
                    ['X', 'X', 'S', 'S', 'S', 'X', 'X'],
                    ['', '', 'S', 'S', 'S', '', ''],
                    ['', '', 'F', '', 'F', '', ''],
                    ['', '', '', '', '', '', ''],
                    ['X', 'X', '', '', '', 'X', 'X'],
                    ['X', 'X', '', '', '', 'X', 'X']]}},
            {set: {key: 'delta', value: {rowBefore: 3, colBefore: 3, rowAfter: 2, colAfter: 3}}}];
        expect(possibleMoves.board === [expectedMove].board).toBe(true);
    });



    it("moving fox to non-adjacent vertices is illegal", function () {
        expectIllegalMove(1, {board:[['X', 'X', '', 'F', '', 'X', 'X'],
                ['X', 'X', '', 'F', '', 'X', 'X'],
                ['', '', '', 'S', '', '', ''],
                ['S', 'S', 'S', 'S', 'S', 'S', 'S'],
                ['S', 'S', '', 'S', 'S', 'S', 'S'],
                ['X', 'X', 'S', 'S', 'S', 'X', 'X'],
                ['X', 'X', 'S', 'S', 'S', 'X', 'X']],delta:{rowBefore: 4, colBefore: 2, rowAfter: 3, colAfter: 2}},
            [{setTurn: {turnIndex: 0}},
                {
                    set: {
                        key: 'board', value: [['X', 'X', '', 'F', '', 'X', 'X'],
                            ['X', 'X', '', '', '', 'X', 'X'],
                            ['', '', 'F', 'S', '', 'F', ''],
                            ['S', 'S', '', 'S', 'S', 'S', 'S'],
                            ['S', 'S', 'S', 'S', 'S', 'S', 'S'],
                            ['X', 'X', 'S', 'S', 'S', 'X', 'X'],
                            ['X', 'X', 'S', 'S', 'S', 'X', 'X']]
                    }
                },
                {set: {key: 'delta', value: {rowBefore: 1, colBefore: 3, rowAfter: 2, colAfter: 5}}}]);


});


    it("after a jump, if there is more jump possibility for this fox, it is still the fox's turn and it must jump", function () {
        expectMoveOk(1, {board:[['X', 'X', '', '', '', 'X', 'X'],
                ['X', 'X', '', 'F', '', 'X', 'X'],
                ['', 'S', 'S', '', '', '', ''],
                ['S', '', '', 'S', 'F', 'S', 'S'],
                ['S', 'S', 'S', 'S', 'S', 'S', 'S'],
                ['X', 'X', 'S', 'S', 'S', 'X', 'X'],
                ['X', 'X', 'S', 'S', 'S', 'X', 'X']],delta:{rowBefore: 1, colBefore: 4, rowAfter: 3, colAfter: 4}},
            [{setTurn: {turnIndex: 1}},
                {
                    set: {
                        key: 'board', value: [['X', 'X', '', '', '', 'X', 'X'],
                            ['X', 'X', '', 'F', '', 'X', 'X'],
                            ['', 'S', 'S', '', '', '', ''],
                            ['S', '', 'F', '', '', 'S', 'S'],
                            ['S', 'S', 'S', 'S', 'S', 'S', 'S'],
                            ['X', 'X', 'S', 'S', 'S', 'X', 'X'],
                            ['X', 'X', 'S', 'S', 'S', 'X', 'X']]
                    }
                },
                {set: {key: 'delta', value: {rowBefore: 3, colBefore: 4, rowAfter: 3, colAfter: 2}}}]);


    });


    it("after a jump, if there is more jump possibility for the other fox, it is still the fox's turn and it must jump", function () {
        expectMoveOk(1, {board:[['X', 'X', '', '', '', 'X', 'X'],
                ['X', 'X', '', 'F', '', 'X', 'X'],
                ['', 'S', 'S', '', '', '', ''],
                ['S', '', 'F', '', '', 'S', 'S'],
                ['S', 'S', 'S', 'S', 'S', 'S', 'S'],
                ['X', 'X', 'S', 'S', 'S', 'X', 'X'],
                ['X', 'X', 'S', 'S', 'S', 'X', 'X']],delta:{rowBefore: 3, colBefore: 4, rowAfter: 3, colAfter: 2}},
            [{setTurn: {turnIndex: 0}},
                {
                    set: {
                        key: 'board', value: [['X', 'X', '', '', '', 'X', 'X'],
                            ['X', 'X', '', '', '', 'X', 'X'],
                            ['', 'S', '', '', '', '', ''],
                            ['S', 'F', 'F', '', '', 'S', 'S'],
                            ['S', 'S', 'S', 'S', 'S', 'S', 'S'],
                            ['X', 'X', 'S', 'S', 'S', 'X', 'X'],
                            ['X', 'X', 'S', 'S', 'S', 'X', 'X']]
                    }
                },
                {set: {key: 'delta', value: {rowBefore: 1, colBefore: 3, rowAfter: 3, colAfter: 1}}}]);


    });


    it("after a jump, if there is more jump possibility for this fox, it is not the sheep's turn yet", function () {
        expectIllegalMove(1, {board:[['X', 'X', '', '', '', 'X', 'X'],
                ['X', 'X', '', 'F', '', 'X', 'X'],
                ['', 'S', 'S', '', '', '', ''],
                ['S', '', '', 'S', 'F', 'S', 'S'],
                ['S', 'S', 'S', 'S', 'S', 'S', 'S'],
                ['X', 'X', 'S', 'S', 'S', 'X', 'X'],
                ['X', 'X', 'S', 'S', 'S', 'X', 'X']],delta:{rowBefore: 1, colBefore: 4, rowAfter: 3, colAfter: 4}},
            [{setTurn: {turnIndex: 0}},
                {
                    set: {
                        key: 'board', value: [['X', 'X', '', '', '', 'X', 'X'],
                            ['X', 'X', '', 'F', '', 'X', 'X'],
                            ['', 'S', 'S', '', '', '', ''],
                            ['S', 'S', '', 'S', 'F', 'S', 'S'],
                            ['S', '', 'S', 'S', 'S', 'S', 'S'],
                            ['X', 'X', 'S', 'S', 'S', 'X', 'X'],
                            ['X', 'X', 'S', 'S', 'S', 'X', 'X']]
                    }
                },
                {set: {key: 'delta', value: {rowBefore: 4, colBefore: 1, rowAfter: 3, colAfter: 1}}}]);


    });





});
