class Calendar {
    constructor(partitionKey, name, owner) {
        this.partition = partitionKey;
        this.name = name;
        this.owner = owner;
    }
}

module.exports = Calendar;