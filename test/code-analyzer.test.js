import assert from 'assert';
import {parseCode} from '../src/js/code-analyzer';

describe('The javascript parser', () => {
    it('is parsing an empty function correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('')),
            '[]'
        );
    });

    it('is parsing a simple variable declaration correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('let a;')),
            '[[1,"VariableDeclarator","a","",""]]'
        );
    });

    it('is parsing a simple variable declaration with value correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('let a = 1;')),
            '[[1,"VariableDeclarator","a","","1"]]'
        );
    });

    it('is parsing a simple func and return declarations correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('function test (x) {return x}')),
            '[[1,"FunctionDeclaration","test","",""],[1,"VariableDeclaration","x","",""],[1,"ReturnStatement","","","x"]]'
        );
    });

    it('is parsing a simple while correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('while (x<1) \n{x=1}')),
            '[[1,"WhileStatement","","x < 1",""],[2,"AssignmentExpression","x","","1"]]'
        );
    });

    it('is parsing a simple if correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('if (x===3) {x=3}')),
            '[[1,"IfStatement","","x === 3",""],[1,"AssignmentExpression","x","","3"]]'
        );
    });

    it('is parsing if-else correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('if (x===3) {x=3}\nelse {x=4}')),
            '[[1,"IfStatement","","x === 3",""],[1,"AssignmentExpression","x","","3"],[2,"AssignmentExpression","x","","4"]]'
        );
    });

    it('is parsing if-else-if correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('if (x===3) {x=3}\nelse if (x===4) {x=4}\nelse {x=5}')),
            '[[1,"IfStatement","","x === 3",""],[1,"AssignmentExpression","x","","3"],[2,"ElseIfStatement","","x === 4",""],[2,"AssignmentExpression","x","","4"],[3,"AssignmentExpression","x","","5"]]'
        );
    });

    it('is parsing if-if correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('function a () {\nif (x===3) {x=3}\nelse {x=4}\nif (x===4) {x=4}}')),
            '[[1,"FunctionDeclaration","a","",""],[2,"IfStatement","","x === 3",""],[2,"AssignmentExpression","x","","3"],[3,"AssignmentExpression","x","","4"],[4,"IfStatement","","x === 4",""],[4,"AssignmentExpression","x","","4"]]'
        );
    });

    it('is parsing a simple for correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('for (x=1;x<10;x++)\n{i=2}')),
            '[[1,"ForStatement","","x = 1;x < 10;x++",""],[2,"AssignmentExpression","i","","2"]]'
        );
    });

    it('is parsing a simple assignment correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('x=1;')),
            '[[1,"AssignmentExpression","x","","1"]]'
        );
    });
});
