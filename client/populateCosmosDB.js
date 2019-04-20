require('dotenv').config();
const CosmosDB = require('../src/CosmosDB');
const User = require('../database/User');
const Calendar = require('../database/Calendar');
const Event = require('../database/Event');

populate()
    .then(() => console.log("Einträge erstellt"));

async function populate() {
    let cosmos = new CosmosDB();

    console.log('BenutzerInnen einfügen...');
    let { body: maja } = await cosmos.insert(new User("user", "Biene Maja"));
    let { body: willi } = await cosmos.insert(new User("user", "Willi"));
    let { body: flip } = await cosmos.insert(new User("user", "Flip"));
    let { body: thekla } = await cosmos.insert(new User("user", "Thekla"));
    let { body: puck } = await cosmos.insert(new User("user", "Puck"));

    console.log('Kalender einfügen...');
    let { body: calMaja } = await cosmos.insert(new Calendar("calendar", "Majas Kalender", maja.id));
    let { body: calThekla } = await cosmos.insert(new Calendar("calendar", "Theklas Kalender", thekla.id));
    maja.calendars.push(calMaja.id);
    thekla.calendars.push(calThekla.id);
    await cosmos.replace(maja, "user");
    await cosmos.replace(thekla, "user");

    console.log('Events einfügen');
    await cosmos.insert(new Event(
        "event", calMaja.id, "Honig sammeln", "Blumenwiese", "Freitagfrüh",
        [willi.id])
    );
    await cosmos.insert(new Event(
        "event", calMaja.id, "Spielen", "Waldrand", "Freitagnachmittag",
        [willi.id, puck.id])
    );
    await cosmos.insert(new Event(
        "event", calMaja.id, "Entspannen", "Waldrand", "Freitagabend",
        [willi.id, puck.id, flip.id])
    );
    await cosmos.insert(new Event(
        "event", calThekla.id, "Netz bauen", "Waldrand", "Freitagfrüh",
        [])
    );
    await cosmos.insert(new Event(
        "event", calThekla.id, "Essen", "Waldrand", "Freitagabend",
        [puck.id])
    );
}
