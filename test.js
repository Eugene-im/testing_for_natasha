

var config = require('./config.json');
const mongodb = require("mongodb").MongoClient;


async function getAll() {
    try {
        const db = await mongodb.connect(config.connectionString);
        console.log('Ok')
        let questCont = {blockCount:[],numInBlock:[]};
        questCont.blockCount = await db.collection("Quest").distinct("block");
        for (let block in questCont.blockCount) 
            questCont.numInBlock[block] = await db.collection("Quest").find({ block: questCont.blockCount[block]}).count();

            if(config.questCount==undefined) config.questCount=0;
            var r = Math.round( config.questCount/Math.max.apply(null, questCont.blockCount));

        for (let block in questCont.blockCount) {
            let num = questCont.numInBlock[block];
            questCont[block]=[];
            for (let i=0; i<r; i++){
               let seed = Math.floor(Math.random() * num);
               if (num>1) while (questCont[block].indexOf(seed)!=-1) {
                    seed = Math.floor(Math.random() * num);
               }
               questCont[block].push(seed);
            }
                
        }

        console.log(questCont)

    } catch (error) {
        console.error(error);
    }
};

getAll();

