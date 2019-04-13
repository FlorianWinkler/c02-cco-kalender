const Loki = require("lokijs");
const User = require('./User');
const Calendar = require('./Calendar');
const Event = require('./Event');

const db = new Loki('demo.json');
const users = db.addCollection('users');
const events = db.addCollection('events');
const calendars = db.addCollection('calendars');

// Einfache Beispieldaten

let klara = new User('Klara');
users.insert(klara);
let klaus = new User('Klaus');
users.insert(klaus);

let klaraCalendar = new Calendar('Klaras Kalender', klara);
calendars.insert(klaraCalendar);
//klara.addCalendar(klaraCalendar); // beim Demo-Setup machen wir das manuell (nicht über REST)

let firstEvent = new Event(
    klaraCalendar,
    "Treffen mit Klaus",
    "Nordpol",
    new Date("2017-12-24 18:00:00"),
    [klara, klaus]
);
events.insert(firstEvent);

let secondEvent = new Event(
    klaraCalendar,
    "Ausschlafen",
    "Couch",
    new Date("2017-12-26 14:00:00"),
    [klara]
);
events.insert(secondEvent);


module.exports = db;
