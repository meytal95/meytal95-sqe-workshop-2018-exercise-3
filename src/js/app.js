import $ from 'jquery';
import {parseCode} from './code-analyzer';
import Viz from 'viz.js';
import {Module,render} from 'viz.js/full.render.js';

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let params=$('#paramsPlaceholder').val();
        let dot = parseCode(codeToParse,params);
        $('#parsedCode').empty();
        let viz=new Viz({Module,render});
        viz.renderString('digraph { '+dot+' }').then(function (graph) {
            document.getElementById('parsedCode').innerHTML=graph;
        });

    });


});


