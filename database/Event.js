class Event {
    constructor(partitionKey, calendar, name, place, startTime, participants) {
        this.partition = partitionKey;
        this.calendar = calendar;
        this.name = name;
        this.place = place;
        this.startTime = startTime;
        this.participants = participants;
    }
}

module.exports = Event;