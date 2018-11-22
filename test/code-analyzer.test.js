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
            '[[1,"variable declaration","a","",""]]'
        );
    });

    it('is parsing a simple variable declaration with value correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('let a = 1;')),
            '[[1,"variable declaration","a","","1"]]'
        );
    });

    it('is parsing a simple func and return declarations correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('function test (x) {return x}')),
            '[[1,"function declaration","test","",""],[1,"variable declaration","x","",""],[1,"return statement","","","x"]]'
        );
    });

    it('is parsing a simple while correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('while (x<1) \n{x=1}')),
            '[[1,"while statement","","x < 1",""],[2,"assignment expression","x","","1"]]'
        );
    });

    it('is parsing a simple if correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('if (x===3) {x=3}')),
            '[[1,"if statement","","x === 3",""],[1,"assignment expression","x","","3"]]'
        );
    });

    it('is parsing if-else correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('if (x===3) {x=3}\nelse {x=4}')),
            '[[1,"if statement","","x === 3",""],[1,"assignment expression","x","","3"],[2,"assignment expression","x","","4"]]'
        );
    });

    it('is parsing if-else-if correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('if (x===3) {x=3}\nelse if (x===4) {x=4}\nelse {x=5}')),
            '[[1,"if statement","","x === 3",""],[1,"assignment expression","x","","3"],[2,"else if statement","","x === 4",""],[2,"assignment expression","x","","4"],[3,"assignment expression","x","","5"]]'
        );
    });

    it('is parsing if-if correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('function a () {\nif (x===3) {x=3}\nelse {x=4}\nif (x===4) {x=4}}')),
            '[[1,"function declaration","a","",""],[2,"if statement","","x === 3",""],[2,"assignment expression","x","","3"],[3,"assignment expression","x","","4"],[4,"if statement","","x === 4",""],[4,"assignment expression","x","","4"]]'
        );
    });

    it('is parsing a simple for correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('for (x=1;x<10;x++)\n{i=2}')),
            '[[1,"for statement","","x = 1;x < 10;x++",""],[2,"assignment expression","i","","2"]]'
        );
    });

    it('is parsing a simple assignment correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('x=1;')),
            '[[1,"assignment expression","x","","1"]]'
        );
    });
});
