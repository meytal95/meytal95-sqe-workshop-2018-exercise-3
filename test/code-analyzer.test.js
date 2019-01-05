import assert from 'assert';
import {parseCode} from '../src/js/code-analyzer';

describe('The javascript parser', () => {

    it('is making simple return correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('function f (x) {\n' +
                'return x;\n' +
                '}','2')),
            '"n0 [label=\\"-1-\\nreturn x;\\"]\\n\\nn0[style=filled,color=green]\\nn0[shape=box]"'
        );
    });

    it('is making simple let&return correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('function f (x) {\n' +
                'let c=x;\n' +
                'return c;\n' +
                '}',3)),
            '"n0 [label=\\"-1-\\nlet c = x;\\"]\\nn1 [label=\\"-2-\\nreturn c;\\"]\\nn0 -> n1 []\\n\\nn0[style=filled,color=green]\\nn0[shape=box]\\nn1[style=filled,color=green]\\nn1[shape=box]"'
        );
    });

    it('is making simple assign correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('function f (x) {\n' +
                'let c=x;\n' +
                'c=c+1;\n' +
                'return c;\n' +
                '}','2')),
            '"n0 [label=\\"-1-\\nlet c = x;\\"]\\nn1 [label=\\"-2-\\nc = c + 1\\"]\\nn2 [label=\\"-3-\\nreturn c;\\"]\\nn0 -> n1 []\\nn1 -> n2 []\\n\\nn0[style=filled,color=green]\\nn0[shape=box]\\nn1[style=filled,color=green]\\nn1[shape=box]\\nn2[style=filled,color=green]\\nn2[shape=box]"'
        );
    });

    it('is making update correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('function f (x) {\n' +
                'let c=x;\n' +
                'c++;\n' +
                'return c;\n' +
                '}','2')),
            '"n0 [label=\\"-1-\\nlet c = x;\\"]\\nn1 [label=\\"-2-\\nc++\\"]\\nn2 [label=\\"-3-\\nreturn c;\\"]\\nn0 -> n1 []\\nn1 -> n2 []\\n\\nn0[style=filled,color=green]\\nn0[shape=box]\\nn1[style=filled,color=green]\\nn1[shape=box]\\nn2[style=filled,color=green]\\nn2[shape=box]"'
        );
    });

    it('is making array update correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('function f (x) {\n' +
                'let c=[3];\n' +
                'c[0]++;\n' +
                'c[0]--;\n' +
                'return c;\n' +
                '}','2')),
            '"n0 [label=\\"-1-\\nlet c = [3];\\"]\\nn1 [label=\\"-2-\\nc[0]++\\"]\\nn2 [label=\\"-3-\\nc[0]--\\"]\\nn3 [label=\\"-4-\\nreturn c;\\"]\\nn0 -> n1 []\\nn1 -> n2 []\\nn2 -> n3 []\\n\\nn0[style=filled,color=green]\\nn0[shape=box]\\nn1[style=filled,color=green]\\nn1[shape=box]\\nn2[style=filled,color=green]\\nn2[shape=box]\\nn3[style=filled,color=green]\\nn3[shape=box]"'
        );
    });

    it('is making simple if correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('function f (x) {\n' +
                'let c=[3];\n' +
                'if(c[0]===1) {x++;}\n' +
                'return c;\n' +
                '}','2')),
            '"n0 [label=\\"-1-\\nlet c = [3];\\"]\\nn1 [label=\\"-2-\\nc[0] === 1\\"]\\nn2 [label=\\"-3-\\nx++\\"]\\nn3 [label=\\"-4-\\nreturn c;\\"]\\nn4 [label=\\"\\"]\\nn0 -> n1 []\\nn1 -> n2 [label=\\"true\\"]\\nn1 -> n4 [label=\\"false\\"]\\nn2 -> n4 []\\nn4 -> n3 []\\n\\nn0[style=filled,color=green]\\nn0[shape=box]\\nn1[style=filled,color=green]\\nn1[shape=diamond]\\nn2[shape=box]\\nn3[style=filled,color=green]\\nn3[shape=box]\\nn4[style=filled,color=green]"'
        );
    });

    it('is making simple if else correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('function f (x) {\n' +
                'let c=[3];\n' +
                'if(c[0]===1) {x++;}\n' +
                'else {x--;}\n' +
                'return c;\n' +
                '}','2')),
            '"n0 [label=\\"-1-\\nlet c = [3];\\"]\\nn1 [label=\\"-2-\\nc[0] === 1\\"]\\nn2 [label=\\"-3-\\nx++\\"]\\nn3 [label=\\"-4-\\nreturn c;\\"]\\nn4 [label=\\"-5-\\nx--\\"]\\nn5 [label=\\"\\"]\\nn0 -> n1 []\\nn1 -> n2 [label=\\"true\\"]\\nn1 -> n4 [label=\\"false\\"]\\nn2 -> n5 []\\nn4 -> n5 []\\nn5 -> n3 []\\n\\nn0[style=filled,color=green]\\nn0[shape=box]\\nn1[style=filled,color=green]\\nn1[shape=diamond]\\nn2[shape=box]\\nn4[style=filled,color=green]\\nn4[shape=box]\\nn3[style=filled,color=green]\\nn3[shape=box]\\nn5[style=filled,color=green]"'
        );
    });

    it('is making simple while correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('function f (x) {\n' +
                'let c=[3,1,1];\n' +
                'while(c[x]<3) {c[x]=c[x]+1;}\n' +
                'return c;\n' +
                '}','2')),
            '"n0 [label=\\"-1-\\nlet c = [\\n    3,\\n    1,\\n    1\\n];\\"]\\nn1 [label=\\"-2-\\nc[x] < 3\\"]\\nn2 [label=\\"-3-\\nc[x] = c[x] + 1\\"]\\nn3 [label=\\"-4-\\nreturn c;\\"]\\nn4 [label=\\"\\"]\\nn0 -> n4 []\\nn1 -> n2 [label=\\"true\\"]\\nn1 -> n3 [label=\\"false\\"]\\nn2 -> n4 []\\nn4 -> n1 []\\n\\nn0[style=filled,color=green]\\nn0[shape=box]\\nn1[style=filled,color=green]\\nn1[shape=diamond]\\nn2[shape=box]\\nn2[style=filled,color=green]\\nn2[shape=box]\\nn2[style=filled,color=green]\\nn2[shape=box]\\nn3[style=filled,color=green]\\nn3[shape=box]\\nn4[style=filled,color=green]"'
        );
    });

    it('is making nested if correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('function f (x) {\n' +
                'let g;\n' +
                'g=3*(x+1);\n' +
                'if (g<9) {\n' +
                'if (g===3) {g=1;}\n' +
                '}\n' +
                'return g;\n' +
                '}','2')),
            '"n0 [label=\\"-1-\\nlet g;\\"]\\nn1 [label=\\"-2-\\ng = 3 * (x + 1)\\"]\\nn2 [label=\\"-3-\\ng < 9\\"]\\nn3 [label=\\"-4-\\ng === 3\\"]\\nn4 [label=\\"-5-\\ng = 1\\"]\\nn5 [label=\\"-6-\\nreturn g;\\"]\\nn6 [label=\\"\\"]\\nn0 -> n1 []\\nn1 -> n2 []\\nn2 -> n3 [label=\\"true\\"]\\nn2 -> n6 [label=\\"false\\"]\\nn3 -> n4 [label=\\"true\\"]\\nn3 -> n6 [label=\\"false\\"]\\nn4 -> n6 []\\nn6 -> n5 []\\n\\nn0[style=filled,color=green]\\nn0[shape=box]\\nn1[style=filled,color=green]\\nn1[shape=box]\\nn2[style=filled,color=green]\\nn2[shape=diamond]\\nn3[shape=diamond]\\nn4[shape=box]\\nn5[style=filled,color=green]\\nn5[shape=box]\\nn6[style=filled,color=green]"'
        );
    });

    it('is making nested while correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('function f (x) {\n' +
                'let g;\n' +
                'g=3*(x+1);\n' +
                'if (g<9) {\n' +
                'let c=10;\n' +
                'g=c;\n' +
                '}\n' +
                'else if(g>9) {\n' +
                'while (g>9) {\n' +
                'g--;\n' +
                '}\n' +
                '}\n' +
                'else {g=2;}\n' +
                'return g;\n' +
                '}','2')),
            '"n0 [label=\\"-1-\\nlet g;\\"]\\nn1 [label=\\"-2-\\ng = 3 * (x + 1)\\"]\\nn2 [label=\\"-3-\\ng < 9\\"]\\nn3 [label=\\"-4-\\nlet c = 10;\\"]\\nn4 [label=\\"-5-\\ng = c\\"]\\nn5 [label=\\"-6-\\nreturn g;\\"]\\nn6 [label=\\"-7-\\ng > 9\\"]\\nn7 [label=\\"-8-\\ng > 9\\"]\\nn8 [label=\\"-9-\\ng--\\"]\\nn9 [label=\\"-10-\\ng = 2\\"]\\nn10 [label=\\"\\"]\\nn11 [label=\\"\\"]\\nn0 -> n1 []\\nn1 -> n2 []\\nn2 -> n3 [label=\\"true\\"]\\nn2 -> n6 [label=\\"false\\"]\\nn3 -> n4 []\\nn4 -> n10 []\\nn6 -> n11 [label=\\"true\\"]\\nn6 -> n9 [label=\\"false\\"]\\nn7 -> n8 [label=\\"true\\"]\\nn7 -> n10 [label=\\"false\\"]\\nn8 -> n11 []\\nn9 -> n10 []\\nn10 -> n5 []\\nn11 -> n7 []\\n\\nn0[style=filled,color=green]\\nn0[shape=box]\\nn1[style=filled,color=green]\\nn1[shape=box]\\nn2[style=filled,color=green]\\nn2[shape=diamond]\\nn3[shape=box]\\nn4[shape=box]\\nn6[style=filled,color=green]\\nn6[shape=diamond]\\nn7[shape=diamond]\\nn8[shape=box]\\nn9[style=filled,color=green]\\nn9[shape=box]\\nn5[style=filled,color=green]\\nn5[shape=box]\\nn10[style=filled,color=green]"'
        );
    });

    it('is making correct decisions correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('function f (x) {\n' +
                'let g;\n' +
                'g=3*(x+1);\n' +
                'if (g<9) {\n' +
                'if (g===9) {g=1;}\n' +
                '}\n' +
                'return g;\n' +
                '}','2')),
            '"n0 [label=\\"-1-\\nlet g;\\"]\\nn1 [label=\\"-2-\\ng = 3 * (x + 1)\\"]\\nn2 [label=\\"-3-\\ng < 9\\"]\\nn3 [label=\\"-4-\\ng === 9\\"]\\nn4 [label=\\"-5-\\ng = 1\\"]\\nn5 [label=\\"-6-\\nreturn g;\\"]\\nn6 [label=\\"\\"]\\nn0 -> n1 []\\nn1 -> n2 []\\nn2 -> n3 [label=\\"true\\"]\\nn2 -> n6 [label=\\"false\\"]\\nn3 -> n4 [label=\\"true\\"]\\nn3 -> n6 [label=\\"false\\"]\\nn4 -> n6 []\\nn6 -> n5 []\\n\\nn0[style=filled,color=green]\\nn0[shape=box]\\nn1[style=filled,color=green]\\nn1[shape=box]\\nn2[style=filled,color=green]\\nn2[shape=diamond]\\nn3[shape=diamond]\\nn4[shape=box]\\nn5[style=filled,color=green]\\nn5[shape=box]\\nn6[style=filled,color=green]"'
        );
    });

    /*
    it('is making simple return correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('function f (x) {\n' +
                'return x;\n' +
                '}','2')),
            '"n0 [label=\\"-1-\\nreturn x;\\"]\\n\\nn0[style=filled,color=green]\\nn0[shape=box]"'
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
    });*/
});
