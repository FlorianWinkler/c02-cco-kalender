class Calendar {
    constructor(partitionKey, rowKey, name, owner) {
        this.PartitionKey = partitionKey;
        this.RowKey = rowKey;
        this.name = name;
        this.owner = owner;
    }

    getId() {
        return this.PartitionKey + ':' + this.RowKey;
    }
}

module.exports = Calendar;