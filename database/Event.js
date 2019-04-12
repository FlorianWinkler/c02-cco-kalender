class Event {
    constructor(partitionKey, rowKey, calendar, name, place, startTime, participants) {
        this.PartitionKey = partitionKey;
        this.RowKey = rowKey;
        this.calendar = calendar;
        this.name = name;
        this.place = place;
        this.startTime = startTime;
        this.participants = participants;
    }

    getId() {
        return this.PartitionKey + ':' + this.RowKey;
    }

    /**
     * Wir haben eine eigene Funktion, die beim Serialisieren als JSON Rücksicht auf TableStorage nimmt
     */
    toJSON() {
        let event = Object.assign({}, this);    // copy/clone
        event.participants = JSON.stringify(event.participants);
        return event;
    }

    static fromStorage(entity) {
        let obj = utils.entityToObject(entity);
        return new Event(
            obj.PartitionKey, obj.RowKey, obj.calendar,
            obj.name, obj.place, obj.startTime,
            JSON.parse(obj.participants)
        );
    }
}

module.exports = Event;