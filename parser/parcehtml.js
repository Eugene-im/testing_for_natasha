let lines = document.getElementsByTagName("p");
let count = 0;

let block = 1;
let num = 0;
let pnum = 1;

let current = 0;

let quest = {};
let objIndex = 0;
let currentIndex = objIndex;

for (let index in lines) {
  let line = lines[index];

  let V0 =
    line.innerText != undefined ? line.innerText.search(/\D+\.\s/) > 0 : false;
  let V1 =
    line.innerHTML != undefined ? line.innerHTML.search(/<b>/) > 0 : false;
  let V2 =
    line.innerText != undefined ? line.innerText.search(/\?/) > 0 : false;
  let V3 =
    line.innerText != undefined ? line.innerText.search(/\)\s/) > 0 : false;
  let V4 =
    line.innerHTML != undefined ? line.innerHTML.search(/<u>/) > 0 : false;

  // if(V0)  {
  //     console.log(V0,V1,V2,V3,'&',line.innerText);
  // }

  if (V2 || V3) {
    if (V1 && V2) {
      let cnum = line.innerText.split(".");
      //if ((cnum.length = 1)) continue;
      pnum = num;
      if (!isNaN(cnum[0])) num = cnum[0];
      if (Number(pnum) > Number(num)) block ++;

      //if (qust[block] == undefined) qust[block] = {};
      //let nQust = qust[block];
      let nQust = quest;
      currentIndex = objIndex;
      //nQust[num] = {
      nQust[objIndex++] = {
        block: block,
        num: +num,
        question: cnum[1],
        variant: []
      };
    }

    if (V3) {
      let nQust = quest;

      //if (nQust[num] == undefined) continue;
      let cansv = line.innerText.split(")");
      //if (nQust[currentIndex].variant != undefined)
      nQust[currentIndex].variant.push({
        text: cansv[1],
        value: V4 ? true : false
      });
      //if (V4) nQust[num].rigth = cansv;
    }

    //console.log(V0, V1, V2, V3, V4, "#", line.innerText);
    if (V2) count++;
  }
}

console.log("##", count);
//console.log("$$", JSON.stringify(quest, null, 2));

text = JSON.stringify(quest, null, 2);



function download(text=quest, name='file.json', type='text/plain') {

text = JSON.stringify(text, null, 2);

  var a = document.getElementById("a");
  var file = new Blob([text], {type: type});
  a.href = URL.createObjectURL(file);
  a.download = name;
}

download();

for (let index in quest){
  let ansCount = 0;
  let vopros = quest[index];
  for(let ans in vopros['variant']){
    let ansver = vopros.variant[ans];
    if (ansver['value']==true) ansCount++;
    //console.log(ansver);
  }
  if (ansCount>1)
    console.log(vopros['block'],vopros['num'], vopros['variant']);
}