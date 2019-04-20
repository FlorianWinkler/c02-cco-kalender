const express = require('express');
const db = require('../database/database');
const Event = require('../database/Event');
const CosmosDB = require("../src/CosmosDB");
const BlobStorage = require("../src/BlobStorage");

const router = express.Router();

router.get('/', getAllEvents);
router.post("/", createEvent);
router.get('/:eventId', getSingleEvent);

let eventCollection = db.getCollection('events');

// function getAllEvents(request, response) {
//     let events = null;
//
//     let participantQuery = request.query.participant;
//     if (typeof participantQuery !== 'undefined') {
//         let userCollection = db.getCollection('users');
//         let user = userCollection.get(participantQuery);
//         events = eventCollection.where(function (ev) {
//             return ev.participants.includes(user);
//         });
//     } else {
//         events = eventCollection.find();
//     }
//
//     response.json(events);
// }
async function getAllEvents(request, response) {
    let events = null;
    let cosmos = new CosmosDB();

    let participantQuery = request.query.participant;
    if (typeof participantQuery !== 'undefined') {
        events = await cosmos.find(
            'SELECT * FROM ev WHERE ev.partition="event" ' +
            'AND ARRAY_CONTAINS(ev.participants,@user)',[{
                name: "@user",
                value: participantQuery
            }]
        );
    } else {
        events = await cosmos.find('SELECT * FROM ev WHERE ev.partition="event"');
    }

    response.json(events);
}

// function getSingleEvent(request, response) {
//     let eventId = request.params.eventId;
//     let event = eventCollection.get(eventId);
//     response.json(event);
// }
async function getSingleEvent(request, response) {
    let cosmos = new CosmosDB();
    try {
        let event = await cosmos.get(request.params.eventId,"event");
        response.json(event.body);
        let blobStorage = new BlobStorage('blob');
        blobStorage.appendTextToBlob('blob-append','getSingleEvent:'+event.body);
    } catch (e) {
        console.log(e);
    }
}

function createEvent(request, response) {
    let userCollection = db.getCollection('users');
    let calendarCollection = db.getCollection('calendars');

    let calendar = calendarCollection.get(request.body.calendar);
    let participants = [];
    for (let user of request.body.participants) {
        participants.push(userCollection.get(user));
    }
    let event = new Event(calendar, request.body.name, request.body.place, request.body.startTime, participants);
    eventCollection.insert(event);

    response.json(event);
}

module.exports = router;
