const config = require("../config.json");
const mongoClient = require("mongodb").MongoClient;

async function getAll() {
  try {
    const db = await mongoClient.connect(config.connectionString);

    let questCont = {
      blockCount: [],
      numInBlock: []
    };

    questCont.blockCount = await db.collection("Quest").distinct("block");

    for (let blIndex in questCont.blockCount) {
      // get num quest in block
      let block = questCont.blockCount[blIndex];

      questCont.numInBlock[blIndex] = await db
        .collection("Quest")
        .find({
          block: block
        })
        .count();

      let num = questCont.numInBlock[blIndex];

      for (let index = 0; index < num; index++) {
        let cursor = db.collection("Quest").find({
          block: block,
          num: index
        });
        for (
          let doc = await cursor.next(); doc != null; doc = await cursor.next()
        ) {
          //console.log(block, num, doc);
          if (doc["variant"] && doc.variant.length > 4) {
            console.log(block, index, ">4", doc);
          }
          if (!doc["variant"] && doc.variant.length < 2) {
            console.log(block, index, "v-", doc);
          }
          if (doc["variant"]) {
            let vprCnt = 0;
            for (let nvrt = 0; nvrt < doc.variant.length; nvrt++) {
              if (doc.variant[nvrt].value) vprCnt++;
              if (!doc.variant[nvrt].text) console.log(block, index, "T", doc);;
            }
            if (vprCnt > 1) console.log(block, index, ">1", doc);
            if (!vprCnt) console.log(block, index, "v0", doc);
          }
          if (!doc["question"]) {
            console.log(block, index, "_", doc);
          }
        }
      }
      // 
      let cursor = db.collection("Quest").find();
      let cursor2 = db.collection("Quest").find();
      for (
        let doc = await cursor.next(); doc != null; doc = await cursor.next()
      ) {
        for (
          let docI = await cursor2.next(); docI != null; docI = await cursor2.next()
        ) {
          if ((doc.block != docI.block) && (doc.num != docI.num)) {
            if (doc["question"] == docI["question"])
              console.log('duplicate question', docI);
          }
        }
      }
    }
    //console.log(JSON.stringify(questCont, "", 2));
    db.close();
  } catch (error) {
    console.error(error);
  } finally {}
}

getAll();