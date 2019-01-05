import * as esprima from 'esprima';
import * as escodegen from 'escodegen';
import * as esgraph from 'esgraph';

let varHash = new Map();
let pVals;
let addons='';
let node;
let g;
let n;

const parseTypes = {
    'VariableDeclaration': parseVarDecl,
    'ReturnStatement': parseRetStmt,
    'FunctionDeclaration': parseFunc,
    'WhileStatement': parseWhileStmt,
    'IfStatement': parseIf,
    'BlockStatement': parseBlock,
    'ExpressionStatement': parseExpr,
    'AssignmentExpression': parseAssExpr,
    'UpdateExpression': parseUp
};

const parseCode = (codeToParse,params) => {
    pVals=eval('['+params+']');
    let data = (esprima.parseScript(codeToParse, {loc: true}).body);
    addons='';
    n=0;
    let graph=getGraph(data[0].body);
    g=graph[2];
    node=graph[0];
    makeArr(data[0],true);
    graph[2]=finTouch(graph[2]);
    graph = esgraph.dot(graph);

    return graph+addons;
};

const getGraph=(code)=> {

    let cfg = esgraph(code);
    return editGraph(cfg,{range: true});
};

function finTouch(graph) {
    let i,l=graph.length;
    for (i=0;i<l;i++) {
        if(graph[i].prev.length>1) {
            let node={label:''};
            graph.push(node);
            node.prev=graph[i].prev; node.next=graph[i];
            node.nextSibling=graph[i];
            node.normal=graph[i];
            if(graph[i].color!==undefined) addons+='\nn'+(l+n)+'[style=filled,color=green]';
            graph[i].prev=[node];
            node.prev.forEach(pnode=> {
                pnode.next[pnode.next.indexOf(graph[i])]=node;
                if(pnode.nextSibling!==undefined) pnode.nextSibling=node;
                if(pnode.normal!==undefined) pnode.normal=node; checkTF(pnode,graph[i],node);
            }); n++;
        }
    }
    return graph;
}

function checkTF(pnode,gnode,node){
    if(pnode.true===gnode) pnode.true=node;
    if(pnode.false===gnode) pnode.false=node;
}

function editGraph(graph){
    let g = graph[2].slice(1,graph[2].length-1);
    let badnode=graph[1];
    let indx=1;
    g[0].prev=[]; graph[0]=g[0];
    graph[2]=g;
    graph[2].forEach(node=>{
        node.label='-'+indx+'-\n' + escodegen.generate(node.astNode);
        indx++;
        let index = node.next.indexOf(badnode);
        if (index > -1) {
            node.next.splice(index, 1);
        }
        if(node.normal===badnode) node.normal=undefined;
        if(node.astNode.type==='ReturnStatement') graph[1]=node;
        node.exception=undefined;
    });
    graph[1].normal=undefined;
    return graph;
}

function makeArr(data,isPath) {
    let x = parseTypes[data.type];
    return x(data,isPath);
}

function parseUp(data,isPath) {
    if(isPath) {
        uphelp(data);
    }
    if(isPath) {addons+='\nn'+g.indexOf(node)+'[style=filled,color=green]';node.color='g';}
    addons+='\nn'+g.indexOf(node)+'[shape=box]';
    node=node.normal;
    return isPath;
}

function uphelp(data){
    if(data.argument.type==='MemberExpression'){
        parseUparr(data);
    }
    else {
        if(data.operator==='++')
            varHash.set(data.argument.name,varHash.get(data.argument.name)+1);
        else
            varHash.set(data.argument.name,varHash.get(data.argument.name)-1);
    }
}

function parseUparr(data){
    if (data.operator==='++'){
        let val=varHash.get(data.argument.object.name);
        val[getVal(escodegen.generate(data.argument.property))]++;
        varHash.set(data.argument.object.name,val);
    }
    else
    {
        let val=varHash.get(data.argument.object.name);
        val[getVal(escodegen.generate(data.argument.property))]--;
        varHash.set(data.argument.object.name,val);
    }
}

function parseBlock(data,isPath) {
    return data.body.map((i)=>makeArr(i,isPath));
}

function parseExpr(data,isPath) {
    return makeArr(data.expression,isPath);
}

function parseVarDecl(data,isPath) {
    let decs = data.declarations;
    for (let x of decs) {
        if (isPath) varHash.set(x.id.name,(x.init === null) ? null : getVal(escodegen.generate(x.init)));
    }
    if(isPath) {addons+='\nn'+g.indexOf(node)+'[style=filled,color=green]';node.color='g';}
    addons+='\nn'+g.indexOf(node)+'[shape=box]';
    node=node.normal;
    return isPath;
}

function parseRetStmt(data,isPath) {
    addons+='\nn'+g.indexOf(node)+'[style=filled,color=green]';
    node.color='g';
    addons+='\nn'+g.indexOf(node)+'[shape=box]';
    return isPath;
}

function parseFunc(data,isPath) {
    parseParams(data.params);
    return (data.body.body.map((i)=>makeArr(i,isPath)));
}

function parseParams(data) {
    let i;
    for(i=0;i<data.length;i++)
        varHash.set(data[i].name,pVals[i]);
}

function parseWhileStmt(data,isPath) {
    let p=false;
    let path=[isPath];
    let rest=[];
    if(isPath) {addons+='\nn'+g.indexOf(node)+'[style=filled,color=green]';node.color='g';}
    addons+='\nn'+g.indexOf(node)+'[shape=diamond]';
    do {
        node=node.true;
        rest = makeArr(data.body,p&&isPath);
        p=getVal(escodegen.generate(data.test));
    } while(p);
    path.push(rest);

    node=node.false;
    return path;
}

function parseIf(data,isPath) {
    let path=[isPath];
    let p=getVal(escodegen.generate(data.test));
    let pnode = node;
    if(isPath) {addons+='\nn'+g.indexOf(node)+'[style=filled,color=green]';node.color='g';}
    addons+='\nn'+g.indexOf(node)+'[shape=diamond]';
    node=node.true;
    path.push(makeArr(data.consequent,p&&isPath));
    if (data.alternate !== null) {
        node=pnode.false;
        path.push(makeArr(data.alternate,!p&&isPath));
    }
    return path;
}

function parseAssExpr(data,isPath) {
    if (isPath) {
        if (data.left.type==='MemberExpression')
        {
            let val = varHash.get(data.left.object.name);

            val[getVal(escodegen.generate(data.left.property))]=getVal(escodegen.generate(data.right));
            varHash.set(data.left.object.name,val);
        }
        else varHash.set(data.left.name,getVal(escodegen.generate(data.right)));
    }
    if(isPath) {addons+='\nn'+g.indexOf(node)+'[style=filled,color=green]';node.color='g';}
    addons+='\nn'+g.indexOf(node)+'[shape=box]';
    node=node.normal;
    return isPath;
}

function getVal(code) {
    let tokens = code.split(' ');
    let line='';
    tokens.forEach(token=>{
        if(varHash.has(token))
            token = JSON.stringify(varHash.get(token));
        else {
            let t=token.replace(/\[|\(|\]|\)|;/g,'');
            if(varHash.has(t))
                token = token.replace(t,JSON.stringify(varHash.get(t)));
            else {
                token=checkarr(token);
            }
        }
        line=line+' ' + token;
    });
    return eval(line);
}

function checkarr(token) {
    let arrs = token.split(/\[|\]/);
    if(varHash.has(arrs[0])) token = token.replace(arrs[0],JSON.stringify(varHash.get(arrs[0])));
    if (arrs.length>1&&varHash.has(arrs[1])) token = token.replace(arrs[1],JSON.stringify(varHash.get(arrs[1])));
    return token;
}
export {parseCode};
export {getGraph};
