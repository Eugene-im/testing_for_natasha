var config = require('config.json');
var express = require('express');
var router = express.Router();
var questService = require('services/quest.service');
const mongoClient = require("mongodb").MongoClient;
// routes

router.get('/getall', getAll);
router.get('/getbynum', getByNum);

module.exports = router;

async function getAll(req, res) {
    let quest = [];
    let proba = 0;
    try {
        const db = await mongoClient.connect(config.connectionString);
        let questCont = {blockCount:[],numInBlock:[]};
        questCont.blockCount = await db.collection("Quest").distinct("block");
        if(config.questCount==undefined) config.questCount=0;
        if(config.mainQuestionBlockCount==undefined) config.mainQuestionBlockCount=questCont.blockCount;
        let questInBlock = Math.round(config.questCount/config.mainQuestionBlockCount);
        for (let block in questCont.blockCount) {
            // get num quest in block
            questCont.numInBlock[block] = await db.collection("Quest").find({ block: questCont.blockCount[block]}).count();  
            // get random massive quevery
            let num = questCont.numInBlock[block];
            // bonus quest 1 in block
            let numInBlock=(block <config.mainQuestionBlockCount) ? questInBlock: 1;
            do {
                questCont[block]=[];
                for (let i=0; i<numInBlock; i++){
                    let seed = Math.floor(Math.random() * num);
                    if (num>questInBlock) {
                        while (questCont[block].indexOf(seed)!=-1 ||seed == 0 || proba>100) {
                            seed = Math.floor(Math.random() * num);
                            proba++;
                        }
                    }
                   questCont[block].push(seed);
                };
                proba++;
            } while (await db.collection("Quest").find({block:questCont.blockCount[block], num :{$in : questCont[block]}}).count()!= numInBlock || proba>100);

            // get quest
            let cursor = db.collection("Quest").find({block:questCont.blockCount[block], num :{$in : questCont[block]}})
            for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
                quest.push(doc);
            }
        }
        console.log(questCont,quest.length,proba)
        db.close();
    } catch (error) {
        console.error(error);
    }finally{
        res.send(quest)
    }   
}

function getByNum(req, res) {
    
    res.send("here mast be quest by num");
}