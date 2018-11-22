import * as esprima from 'esprima';
import * as barakgay from 'escodegen';

let thing=[];
let amElse=false;

const parseTypes = {
    'VariableDeclaration': parseVarDecl,
    'ReturnStatement': parseRetStmt,
    'FunctionDeclaration': parseFunc,
    'WhileStatement': parseWhileStmt,
    'IfStatement': parseIf,
    'BlockStatement' : parseBlock,
    'ForStatement': parseFor,
    'ExpressionStatement' : parseExpr,
    //'UpdateExpression': parseUpdateExpr,
    'AssignmentExpression': parseAssExpr
};

const parseCode = (codeToParse) => {
    thing=[];
    let data=(esprima.parseScript(codeToParse, {loc: true}).body);
    //return data;
    if (data.length===0)
        return thing;
    barakhomo(data[0]);
    return (thing);
};

function barakhomo(data) {
    let x = parseTypes[data.type];
    return x(data);
}

function parseBlock(data) {
    data.body.map(barakhomo);
}

function parseExpr(data) {
    barakhomo(data.expression);
}

function parseVarDecl(data) {
    let decs=data.declarations;
    for(var x of decs) {
        let vdecl = [5];
        vdecl[0] = x.id.loc.start.line;
        vdecl[1] = x.type;
        vdecl[2] = x.id.name;
        vdecl[3] = '';
        vdecl[4] =(x.init===null) ? '' : barakgay.generate(x.init);
        thing.push(vdecl);
    }
}

function parseRetStmt(data) {
    let vdecl = [5];
    vdecl[0] = data.loc.start.line;
    vdecl[1] = data.type;
    vdecl[2] = '';
    vdecl[3] = '';
    vdecl[4] =barakgay.generate(data.argument);
    thing.push(vdecl);

}

function parseFunc(data) {
    let vdecl = [5];
    vdecl[0] = data.id.loc.start.line;
    vdecl[1] = data.type;
    vdecl[2] = data.id.name;
    vdecl[3] = '';
    vdecl[4] = '';
    thing.push(vdecl);
    data.params.map(parseParams);
    data.body.body.map(barakhomo);
}

function parseParams(data) {
    let vdecl = [5];
    vdecl[0] = data.loc.start.line;
    vdecl[1] = 'VariableDeclaration';
    vdecl[2] = data.name;
    vdecl[3] = '';
    vdecl[4] = '';
    thing.push(vdecl);
}

function parseWhileStmt(data) {
    let vdecl = [5];
    vdecl[0] = data.loc.start.line;
    vdecl[1] = data.type;
    vdecl[2] = '';
    vdecl[3] = barakgay.generate(data.test);
    vdecl[4] = '';
    thing.push(vdecl);
    data.body.body.map(barakhomo);
}

function parseIf(data) {
    let vdecl = [5];
    vdecl[0] = data.loc.start.line;
    vdecl[1] = (amElse)? 'ElseIfStatement' : data.type;
    vdecl[2] = '';
    vdecl[3] = barakgay.generate(data.test);
    vdecl[4] = '';
    thing.push(vdecl);
    amElse=false;
    barakhomo(data.consequent);
    if (data.alternate !== null)
    {
        amElse=true;
        barakhomo(data.alternate);
        amElse=false;
    }
}

function parseFor(data) {
    let vdecl = [5];
    vdecl[0] = data.loc.start.line;
    vdecl[1] = data.type;
    vdecl[2] = '';
    vdecl[3] = barakgay.generate(data.init)+ ';' + barakgay.generate(data.test) + ';' + barakgay.generate(data.update);
    vdecl[4] = '';
    thing.push(vdecl);
    barakhomo(data.body);
}

function parseAssExpr(data) {
    let vdecl = [5];
    vdecl[0] = data.loc.start.line;
    vdecl[1] = data.type;
    vdecl[2] = data.left.name;
    vdecl[3] = '';
    vdecl[4] = barakgay.generate(data.right);
    thing.push(vdecl);
}

export {parseCode};
