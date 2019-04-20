class User {
    constructor(partitionKey, name) {
        this.partition = partitionKey;
        this.name = name;
        this.calendars = [];
    }
}

module.exports = User;