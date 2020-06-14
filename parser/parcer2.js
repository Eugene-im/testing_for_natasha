/*
 *
 * <p> 
 *  innerHTML </u> <b> <br> ↵
 *  innerText  '0.' ,') '
 * </p>
 */

'use strict;'

const questions = {};

let outJson ={};

let blockNum=1;
let questionsCount = 0;
let numCount=0;
let currentNum=0;


if (typeof document!="undefined"){
    let pBlocks = document.getElementsByTagName("p");

    for (let index in pBlocks) {
        let pBlock = pBlocks[index];

        let solid    =pBlock.innerHTML != undefined ?pBlock.innerHTML.search(/<b>/) != -1 : false;
        let underLine=pBlock.innerHTML != undefined ?pBlock.innerHTML.search(/<u>/) != -1 : false;
        
        let numPoint =pBlock.innerText != undefined ?pBlock.innerText.search(/\d+.\s/) != -1 : false;  // '0._'
        let ternar   =pBlock.innerText != undefined ?pBlock.innerText.search(/\?|\:/) != -1 : false;
        let varSpace =pBlock.innerText != undefined ?pBlock.innerText.search(/^\S\)\s/) != -1 : false;    // 'w)_'

        // if multi p split
        let nextLine =pBlock.innerHTML != undefined ? pBlock.innerHTML.search(/<br>/) != -1 : false;
        let enter    =pBlock.innerHTML != undefined ? pBlock.innerText.search(/↵?↵/) != -1 : false;

        let line = pBlock.innerText;
        //if(nextLine|enter) line = lines.split(/<br>|↵/);
        let vopros = numPoint && solid && ternar;
        let variant = varSpace;
        if (variant && vopros) {
            console.error('#'+blockNum+'.'+currentNum,
            numPoint,'.  ',ternar,'?  ',varSpace,')  ',solid,'b  ',underLine,'_  ');
            console.log('=>',line);
            continue;
        }
        if(vopros) {
            //add question
            //console.log('&',line)
            line = line.split('.');
            let numQuestion = line.shift();
            if(!isNaN(numQuestion)) {
                numQuestion = Number(numQuestion);
            }else {
                numQuestion =  currentNum+1;
            };
            if(currentNum>numQuestion) {
                console.log('Block',blockNum,'=>',(blockNum+1),':',currentNum,'>>',numQuestion);
                blockNum++;
            }
            currentNum = numQuestion;
            let currentQuestion = line.join('.');
            // add new object
            questions[numCount++]={
                block: blockNum,
                num: numQuestion,
                question:currentQuestion,
                variant: []
            };
            questionsCount++;
        } else if(variant ){
            line = line.split(')');
            questions[numCount-1].variant.push({
                text: line[1],
                value: underLine ? true : false
              });
        }

    
        outJson = JSON.stringify(questions, null, 2);
        //console.log('$$',outJson)
    }
    console.log("All questions count:", questionsCount,'in',blockNum,'blocks');


    function download(text=outJson, name='file.json', type='text/plain') {
    
        var a = document.getElementById("a");
        var file = new Blob([text], {type: type});
        a.href = URL.createObjectURL(file);
        a.download = name;
    };
    
    download();
    console.error('Duplicate ------------------------------------------------------')
    for (let index in questions){
        let ansCount = 0;
        let vopros = questions[index];
        for(let ans in vopros['variant']){
          let ansver = vopros.variant[ans];
          if (ansver['value']==true) ansCount++;
          //console.log(ansver);
        }
        if (ansCount>1)
          console.log('Block',vopros['block'],'Num',vopros['num'],':', vopros['variant']);
      }

} else{
//=====================================================================================================

    let text = `17. <br> Оберіть підстави ухвалення судом додаткового судового рішення: ... ?↵
                а) судом не вирішено питання про судові витрати;↵
                б) внесення виправлень у судове рішення;↵
                в) роз’яснення судового рішення.↵↵`
    console.log(text.match (/↵/g));
    console.log(text.search(/↵/));

    console.log(text.match (/↵+/));
    console.log(text.search(/\↵+/g));

    console.log(text.match (/↵?↵/));
    console.log(text.search(/↵?↵/g));

    console.log(/↵/.test(text));
    console.log('text'.search(/↵/g));
    console.log(text.split(/<br>|↵/));

    console.log('c) text'.search(/^\S\)\s/));
    console.log(' c)text'.search(/^\S\)\s/));
    console.log('А) за принципом'.search(/^\S\)\s/));
    console.log(' судді (судді-доповідачу) передаються'.search(/^\S\)\s/));
    console.log(' vc) text'.search(/^\S\)\s/));
    console.log(' c) text f) '.search(/^\S\)\s/));

    console.log('1. '.search(/\d.\s/));
    console.log('38. Протягом яко'.search(/\d+.\s/));
    console.log('fdf58. Протягом яко'.search(/^\d+.\s/));

    console.log('fdf58. Протягом яко?'.search(/\?|\:/));
    console.log('fdf58. Протягом яко:'.search(/\?|\:/));
    console.log('fdf58. Протягом яко...'.search(/\?|\:/));
    console.log('fdf58. Протягом яко... jhgh. hgh'.split('.').shift());
}
