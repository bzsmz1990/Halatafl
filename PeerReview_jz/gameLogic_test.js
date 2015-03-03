/**
 * @author: Jingxin Zhu
 * @date  : 2015.03.01
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

    function getInitialGameBoard() {
        return board = 
            [
            // 0    1    2    3    4    5    6
             ['X', 'X', 'F', '' , 'F', 'X', 'X'], // 0
             ['X', 'X', '' , '' , '' , 'X', 'X'], // 1 
             ['' , '' , '' , '' , '' , '' , '' ], // 2
             ['S', 'S', 'S', 'S', 'S', 'S', 'S'], // 3
             ['S', 'S', 'S', 'S', 'S', 'S', 'S'], // 4
             ['X', 'X', 'S', 'S', 'S', 'X', 'X'], // 5
             ['X', 'X', 'S', 'S', 'S', 'X', 'X']  // 6
            ]
    }

    function setDelta(delta) {
        return {rowBefore: delta[0][0], 
                colBefore: delta[0][1], 
                rowAfter : delta[1][0], 
                colAfter : delta[1][1]};
    }

    function expectRightMove(description, playerIndex, boardAfter, delta) {
        it ("[Right] " + description, function(){
            expectMoveOk(playerIndex, {}, [
                {setTurn: {turnIndex: (1 - playerIndex)}},
                {set: {key: 'board', value: boardAfter}},
                {set: {key: 'delta', value: delta}}
                ]);
        });
    }

    function expectWrongMove(description, playerIndex, delta) {
        it ("[Wrong] " + description, function(){
            expectIllegalMove(playerIndex, {}, [
                {setTurn: {turnIndex: (1 - playerIndex)}},
                {set: {key: 'board', value: getInitialGameBoard()}},
                {set: {key: 'delta', value: delta}}
                ]);
        });
    }

    describe("[Sheep initial move]", function(){

        // right case
        for (var i = 0; i < 7; i++) {
            // sheep can only move upwards by one step initially
            var description = "moving from (3," + i + ") to (2," + i + ")";
            var delta = setDelta([[3, i], [2, i]]);
            var board = getInitialGameBoard();
            board[3][i] = '';
            board[2][i - 1] = 'R';

            expectRightMove(description, 0, board, delta);

        }

        // wrong case
        for (var i = 0; i < 7; i++) {
            // sheep cannot move left upwards
            var description = "moving from (3," + i + ") to (2," + (i - 1) + ")";
            var delta = setDelta([[3, i], [2, i - 1]]);
            var board = getInitialGameBoard();
            board[3][i] = '';
            board[2][i - 1] = 'X';
            expectWrongMove(0, delta);

            // cannot move right upwards
            description = "moving from (3," + i + ") to (2," + (i + 1) + ")";
            board = getInitialGameBoard();
            board[3][i] = '';
            board[2][i - 1] = 'X';
            delta = setDelta([[3, i], [2, i + 1]]);

            expectWrongMove(0, delta);
        }

    });

    describe("[Fox initial move]", function() {

        function foxRightInitial(rowBefore, colBefore, rowAfter, colAfter) {
            var description = "moving from (" + rowBefore + "," + colBefore + ") to (" + rowAfter + "," + colAfter+ ")";
            var boardAfter = getInitialGameBoard();
            boardAfter[rowBefore][colBefore] = '';
            boardAfter[rowAfter][colAfter] = 'F';
            var playerIndex = 1;
            var delta = setDelta([[rowBefore,colBefore], [rowAfter, colAfter]]);
            expectRightMove(description, playerIndex, boardAfter, delta);
        }

        function foxWrongInitial(rowBefore, colBefore, rowAfter, colAfter) {
            var description = "moving from (" + rowBefore + "," + colBefore + ") to (" + rowAfter + "," + colAfter+ ")";
            var boardAfter = getInitialGameBoard();
            boardAfter[rowBefore][colBefore] = '';
            boardAfter[rowAfter][colAfter] = 'F';
            var playerIndex = 1;
            var delta = setDelta([[rowBefore,colBefore], [rowAfter, colAfter]]);
            expectWrongMove(description, playerIndex, boardAfter, delta);
        }

        // fox that is initially at [0,2]
        // this fox can move right, downwards, or right dounwards
        foxRightInitial(0, 2, 0, 3);
        foxRightInitial(0, 2, 1, 2);
        foxRightInitial(0, 2, 1, 3);

        // fox that is initially at [0, 4]
        // this fox can move right, downwards, or left dounwards
        foxRightInitial(0, 4, 0, 3);
        foxRightInitial(0, 4, 1, 4);
        foxRightInitial(0, 4, 1, 3);

        for (var i = 2; i < 7; i++) {
            for (var j = 0; j < 7; j++) {
                foxWrongInitial(0, 2, i, j);
            }
        }


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

    it("when sheep is winner, any move is illegal", function () {
        expectIllegalMove(1, {board:[['X', 'X', 'S', 'S', 'S', 'X', 'X'],
                ['X', 'X', 'S', 'S', 'S', 'X', 'X'],
                ['F', '', 'S', 'S', 'S', '', 'F'],
                ['S', '', '', '', '', '', 'S'],
                ['S', 'S', '', '', '', '', 'S'],
                ['X', 'X', '', '', 'S', 'X', 'X'],
                ['X', 'X', '', '', 'S', 'X', 'X']],delta:{rowBefore: 3, colBefore: 4, rowAfter: 2, colAfter: 4}},
            [{setTurn: {turnIndex: 0}},
             {set: {key: 'board', value: [['X', 'X', 'S', 'S', 'S', 'X', 'X'],
                            ['X', 'X', 'S', 'S', 'S', 'X', 'X'],
                            ['', 'F', 'S', 'S', 'S', '', 'F'],
                            ['S', '', '', '', '', '', 'S'],
                            ['S', 'S', '', '', '', '', 'S'],
                            ['X', 'X', '', '', 'S', 'X', 'X'],
                            ['X', 'X', '', '', 'S', 'X', 'X']]
                    }
                },
                {set: {key: 'delta', value: {rowBefore: 2, colBefore: 0, rowAfter: 5, colAfter: 8}}}]);
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
