require('dotenv').config();
const TableStorage = require('../src/TableStorage');
const User = require('../database/User');
const Calendar = require('../database/Calendar');
const Event = require('../database/Event');

populate()
    .then(() => console.log("Einträge erstellt"));

async function populate() {
    let users = new TableStorage("users");
    let calendars = new TableStorage("calendars");
    let events = new TableStorage("events");

    console.log('Erstelle Tabellen...');
    await users.createTableIfNotExists();
    await calendars.createTableIfNotExists();
    await events.createTableIfNotExists();


    console.log('Erstelle Daten...');
    let maja = new User("B", "1", "Biene Maja");
    let willi = new User("W", "1", "Willi");
    let flip = new User("F", "1", "Flip");
    let thekla = new User("T", "1", "Thekla");
    let puck = new User("P", "1", "Puck");

    // Kalender
    let calMaja = new Calendar("M", "1", "Majas Kalender", maja.getId());
    maja.calendars.push(calMaja.getId());
    let calThekla = new Calendar("T", "1", "Theklas Kalender", thekla.getId());
    thekla.calendars.push(calThekla.getId());

    console.log('BenutzerInnen einfügen...');
    await users.insert(maja.toJSON());
    await users.insert(willi.toJSON());
    await users.insert(flip.toJSON());
    await users.insert(thekla.toJSON());
    await users.insert(puck.toJSON());

    console.log('Kalender einfügen...');
    await calendars.insert(calMaja);
    await calendars.insert(calThekla);

    console.log('Events einfügen');
    await events.insert(new Event(
        "E", "1", calMaja.getId(),
        "Honig sammeln", "Blumenwiese", "Freitagfrüh", [willi.getId()]).toJSON()
    );
    await events.insert(new Event(
        "E", "2", calMaja.getId(),
        "Spielen", "Waldrand", "Freitagnachmittag", [willi.getId(), puck.getId()]).toJSON()
    );
    await events.insert(new Event(
        "E", "3", calMaja.getId(),
        "Entspannen", "Waldrand", "Freitagabend", [willi.getId(), puck.getId(), flip.getId()]).toJSON()
    );
    await events.insert(new Event(
        "E", "4", calThekla.getId(),
        "Netz bauen", "Waldrand", "Freitagfrüh", []).toJSON()
    );
    await events.insert(new Event(
        "E", "5", calThekla.getId(),
        "Essen", "Waldrand", "Freitagabend", [puck.getId()]).toJSON()
    );
}
