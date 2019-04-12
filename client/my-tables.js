require('dotenv').config();
const utils = require('../src/utils');
const TableStorage = require ('../src/TableStorage');

let table = new TableStorage('demo');

let item = {
    PartitionKey: "B",
    RowKey: "2",
    name: "Lisa",
    alter: 6,
    clever: true
};

// table.insert(item).
//     then((resp) => console.log(utils.entityToObject(resp))).
//     catch((err) => console.log(err));

async function addAge() {
    let bart = await table.get("B","1");
    let lisa = await table.get("B", "2");
    bart = utils.entityToObject(bart);
    lisa= utils.entityToObject(lisa);

    console.log('Summe Alter: '+(bart.alter + lisa.alter));
}

console.log("Vor Aufruf");
addAge().then(() => console.log("Funktion fertig"));
console.log("Nach Aufruf");
