const express = require('express');
const Request = require('request');
const db = require('../database/database');
const Calendar = require('../database/Calendar');
const TableStorage = require ('../src/TableStorage');
const utils = require("../src/utils");
const azure = require('azure-storage');

const router = express.Router();

router.get('/', getAllCalendars);
router.post("/", createCalendar);
router.get('/:calendarId', getSingleCalendar);

let calendarCollection = db.getCollection('calendars');

// function getAllCalendars(request, response) {
//     let calendars = calendarCollection.find();
//     response.json(calendars);
// }
async function getAllCalendars(request, response) {
    let table = new TableStorage('calendars');
    let query = azure.TableQuery();
    let result = await table.find(query);

    let calendars = [];
    for (let obj of result.entries){
        calendars.push(utils.entityToObject(obj));
    }
    response.json(calendars);
}

// function getSingleCalendar(request, response) {
//     let calendarId = request.params.calendarId;
//     let calendar = calendarCollection.get(calendarId);
//     response.json(calendar);
// }
async function getSingleCalendar(request, response) {
    let calendarId = request.params.calendarId;
    let partitionKey = calendarId.split(":")[0];
    let rowKey = calendarId.split(":")[1];

    let table = new TableStorage('calendars');
    let result = await table.get(partitionKey, rowKey);

    response.json(utils.entityToObject(result));
}

// function createCalendar(request, response) {
//     let userCollection = db.getCollection('users');
//     let user = userCollection.get(request.body.owner);
//
//     let newCalendar = new Calendar(request.body.name, user);
//     calendarCollection.insert(newCalendar);
//
//     // wir ignorieren die Antwort & mögliche Fehler
//     Request.patch({
//         url: 'http://localhost:3000/users/' + user.$loki,
//         json: { calendar: newCalendar.$loki }
//     });
//
//     response.json(newCalendar);
// }
async function createCalendar(request, response) {
    //let userCollection = db.getCollection('users');
    //let user = userCollection.get(request.body.owner);

    let newCalender = new Calendar(
        request.body.name[0],
        (new Date()).getTime() + "-" + Math.floor(Math.random()+10000),
        request.body.name,
        request.body.user
    )

    let table = new TableStorage('calendars');
    let result = await table.insert(newCalender);

    response.json(result);
}

module.exports = router;
