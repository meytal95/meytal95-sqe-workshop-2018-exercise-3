import * as esprima from 'esprima';
import * as escodegen from 'escodegen';

let thing = [];
let varHash = [];
let amElse = false;

const parseTypes = {
    'VariableDeclaration': parseVarDecl,
    'ReturnStatement': parseRetStmt,
    'FunctionDeclaration': parseFunc,
    'WhileStatement': parseWhileStmt,
    'IfStatement': parseIf,
    'BlockStatement': parseBlock,
    'ForStatement': parseFor,
    'ExpressionStatement': parseExpr,
    'AssignmentExpression': parseAssExpr
};

const parseCode = (codeToParse) => {
    thing = [];
    let data = (esprima.parseScript(codeToParse, {loc: true}).body);
    if (data.length === 0)
        return thing;
    makeArr(data[0]);
    return (thing);
};

function makeArr(data) {
    let x = parseTypes[data.type];
    return x(data);
}

function parseBlock(data) {
    data.body.map(makeArr);
}

function parseExpr(data) {
    makeArr(data.expression);
}

function parseVarDecl(data) {
    let decs = data.declarations;
    for (var x of decs) {
        let vdecl = [5];
        vdecl[0] = x.id.loc.start.line;
        vdecl[1] = 'variable declaration';
        vdecl[2] = x.id.name;
        vdecl[3] = '';
        vdecl[4] = (x.init === null) ? '' : escodegen.generate(x.init);
        thing.push(vdecl);
    }
}

function parseRetStmt(data) {
    let vdecl = [5];
    vdecl[0] = data.loc.start.line;
    vdecl[1] = 'return statement';
    vdecl[2] = '';
    vdecl[3] = '';
    vdecl[4] = escodegen.generate(data.argument);
    thing.push(vdecl);

}

function parseFunc(data) {
    let vdecl = [5];
    vdecl[0] = data.id.loc.start.line;
    vdecl[1] = 'function declaration';
    vdecl[2] = data.id.name;
    vdecl[3] = '';
    vdecl[4] = '';
    thing.push(vdecl);
    data.params.map(parseParams);
    data.body.body.map(makeArr);
}

function parseParams(data) {
    let vdecl = [5];
    vdecl[0] = data.loc.start.line;
    vdecl[1] = 'variable declaration';
    vdecl[2] = data.name;
    vdecl[3] = '';
    vdecl[4] = '';
    thing.push(vdecl);
}

function parseWhileStmt(data) {
    let vdecl = [5];
    vdecl[0] = data.loc.start.line;
    vdecl[1] = 'while statement';
    vdecl[2] = '';
    vdecl[3] = escodegen.generate(data.test);
    vdecl[4] = '';
    thing.push(vdecl);
    data.body.body.map(makeArr);
}

function parseIf(data) {
    let vdecl = [5];
    vdecl[0] = data.loc.start.line;
    vdecl[1] = (amElse) ? 'else if statement' : 'if statement';
    vdecl[2] = '';
    vdecl[3] = escodegen.generate(data.test);
    vdecl[4] = '';
    thing.push(vdecl);
    amElse = false;
    makeArr(data.consequent);
    if (data.alternate !== null) {
        amElse = true;
        makeArr(data.alternate);
        amElse = false;
    }
}

function parseFor(data) {
    let vdecl = [5];
    vdecl[0] = data.loc.start.line;
    vdecl[1] = 'for statement';
    vdecl[2] = '';
    vdecl[3] = escodegen.generate(data.init) + ';' + escodegen.generate(data.test) + ';' + escodegen.generate(data.update);
    vdecl[4] = '';
    thing.push(vdecl);
    makeArr(data.body);
}

function parseAssExpr(data) {
    let vdecl = [5];
    vdecl[0] = data.loc.start.line;
    vdecl[1] = 'assignment expression';
    vdecl[2] = data.left.name;
    vdecl[3] = '';
    vdecl[4] = escodegen.generate(data.right);
    thing.push(vdecl);
}

export {parseCode};
