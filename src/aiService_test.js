/**
 * Created by Wenzhao on 4/6/15.
 */
describe("aiService", function() {

    'use strict';

    var _aiService;

    beforeEach(module("myApp"));

    beforeEach(inject(function (aiService) {
        _aiService = aiService;
    }));

    it("find an immediate winning move", function() {
        var move = _aiService.createComputerMove(
            [['X','X','S', 'S', 'S','X','X'],
                ['X','X','S', 'S', 'S','X','X'],
                ['','','S','','S','',''],
                ['','','F','S','','','F'],
                ['','','','','','',''],
                ['X','X','','','','X','X'],
                ['X','X','','','','X','X']], 1);
        var expectedMove =
            [{endMatch: {endMatchScores: [0, 1]}},
                {set: {key: 'board', value:
                    [['X','X','S', 'S', 'S','X','X'],
                        ['X','X','S', 'S', 'S','X','X'],
                        ['','','S','','S','',''],
                        ['','','','','F','','F'],
                        ['','','','','','',''],
                        ['X','X','','','','X','X'],
                        ['X','X','','','','X','X']]}},
                {set: {key: 'delta', value: {rowBefore: 3, colBefore: 2, rowAfter: 3, colAfter: 4}}}];
        expect(angular.equals(move, expectedMove)).toBe(true);
    });

    it("find an immediate winning move", function() {
        var move = _aiService.createComputerMove(
            [['X','X','S', 'S', 'S','X','X'],
                ['X','X','S', 'S', 'S','X','X'],
                ['F','S','','S','S','',''],
                ['F','','','','','',''],
                ['','','','','','',''],
                ['X','X','','','','X','X'],
                ['X','X','','','','X','X']], 1);
        var expectedMove =
            [{endMatch: {endMatchScores: [0, 1]}},
                {set: {key: 'board', value:
                    [['X','X','S', 'S', 'S','X','X'],
                        ['X','X','S', 'S', 'S','X','X'],
                        ['','','F','S','S','',''],
                        ['F','','','','','',''],
                        ['','','','','','',''],
                        ['X','X','','','','X','X'],
                        ['X','X','','','','X','X']]}},
                {set: {key: 'delta', value: {rowBefore: 2, colBefore: 0, rowAfter: 2, colAfter: 2}}}];
        expect(angular.equals(move, expectedMove)).toBe(true);
    });

    it("find an immediate winning move", function() {
        var move = _aiService.createComputerMove(
            [['X','X','S', 'S', 'S','X','X'],
                ['X','X','S', 'S', 'S','X','X'],
                ['F','','','S','S','',''],
                ['','F','S','','','',''],
                ['','','','','','',''],
                ['X','X','','','','X','X'],
                ['X','X','','','','X','X']], 1);
        var expectedMove =
            [{endMatch: {endMatchScores: [0, 1]}},
                {set: {key: 'board', value:
                    [['X','X','S', 'S', 'S','X','X'],
                        ['X','X','S', 'S', 'S','X','X'],
                        ['F','','','S','S','',''],
                        ['','','','F','','',''],
                        ['','','','','','',''],
                        ['X','X','','','','X','X'],
                        ['X','X','','','','X','X']]}},
                {set: {key: 'delta', value: {rowBefore: 3, colBefore: 1, rowAfter: 3, colAfter: 3}}}];
        expect(angular.equals(move, expectedMove)).toBe(true);
    });

    it("prevents an immediate win", function() {
        var move = _aiService.createComputerMove(
            [['X','X','S', 'S', 'S','X','X'],
                ['X','X','S', 'S', 'S','X','X'],
                ['','','','S','S','',''],
                ['','','S','F','','',''],
                ['F','','','','','S','S'],
                ['X','X','S','','','X','X'],
                ['X','X','','','','X','X']], 1);

        expect(angular.equals(move[2].set.value, {rowBefore: 3, colBefore: 3, rowAfter: 3, colAfter: 1})).toBe(true);
    });

    it("prevents an immediate win", function() {
        var move = _aiService.createComputerMove(
            [['X','X','S', 'S', 'S','X','X'],
                ['X','X','S', 'S', 'S','X','X'],
                ['','','S','S','','',''],
                ['','','','F','S','',''],
                ['','F','','','','','S'],
                ['X','X','S','S','','X','X'],
                ['X','X','','','','X','X']], 1);
        expect(angular.equals(move[2].set.value, {rowBefore: 3, colBefore: 3, rowAfter: 3, colAfter: 5})).toBe(true);
    });

    it("finds the move which will lead to a jump", function() {
        var move = _aiService.createComputerMove(
            [['X','X','S', 'S', 'S','X','X'],
                ['X','X','S', 'S', 'S','X','X'],
                ['','','S','S','','',''],
                ['','','F','','','',''],
                ['','F','','S','','',''],
                ['X','X','S','','','X','X'],
                ['X','X','','','','X','X']], 1);

        expect(angular.equals(move[2].set.value, {rowBefore: 3, colBefore: 2, rowAfter: 3, colAfter: 3})).toBe(true);
    });

    it("find the move which will have the maximum number of jumps", function() {
        var move = _aiService.createComputerMove(
            [['X','X','F', '', '','X','X'],
                ['X','X','S', 'S', '','X','X'],
                ['','','F','','','','S'],
                ['S','S','S','S','S','S',''],
                ['S','S','','S','','S','S'],
                ['X','X','S','S','S','X','X'],
                ['X','X','S','S','S','X','X']], 1);
        expect(angular.equals(move[2].set.value, {rowBefore: 2, colBefore: 2, rowAfter: 4, colAfter: 2})).toBe(true);
    });

});