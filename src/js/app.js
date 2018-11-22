import $ from 'jquery';
import {parseCode} from './code-analyzer';

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = parseCode(codeToParse);
        //$('#parsedCode').empty();
        $('#parsedCode').append(makeTBL(parsedCode));
    });
});

function makeTBL(arr) {
    let res='<table border=1>';
    res+='<tr><td>Row</td><td>Type</td><td>Name</td><td>Condition</td><td>Value</td></tr>';
    for(let i=0; i<arr.length;i++) {
        res += '<tr>';
        for(let j=0;j<arr[i].length;j++) {
            res+='<td>'+arr[i][j] + '</td>';
        }
        res += '</tr>';
    }
    res+='</table>';
    return res;
}
