const utils = require('../src/utils');

class User {
    constructor(partitionKey, rowKey, name) {
        this.PartitionKey = partitionKey;
        this.RowKey = rowKey;
        this.name = name;
        this.calendars = [];
    }

    getId() {
        return this.PartitionKey + ':' + this.RowKey;
    }

    /**
     * Wir haben eine eigene Funktion, die beim Serialisieren als JSON Rücksicht auf TableStorage nimmt
     */
    toJSON() {
        return {
            PartitionKey: this.PartitionKey,
            RowKey: this.RowKey,
            name: this.name,
            calendars: JSON.stringify(this.calendars)
        };
    }

    static fromStorage(entity) {
        let obj = utils.entityToObject(entity);
        let user = new User(obj.PartitionKey, obj.RowKey, obj.name);
        user.calendars = JSON.parse(obj.calendars);
        return user;
    }
}

module.exports = User;