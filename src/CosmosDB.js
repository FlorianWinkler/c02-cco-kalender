const CosmosClient = require('@azure/cosmos').CosmosClient;

const config = {
    endpoint: process.env.COSMOS_DB_ENDPOINT,
    masterKey: process.env.COSMOS_DB_MASTER_KEY
};


class CosmosDB {
    constructor(databaseId=null, collectionId=null) {
        this.client = new CosmosClient({
            endpoint: config.endpoint,
            auth: {masterKey: config.masterKey}
        });
        this.databaseId = databaseId || process.env.COSMOS_DEFAULT_DB;
        this.collectionId = collectionId || process.env.COSMOS_DEFAULT_COLLECTION;
    }

    createDatabaseIfNotExists() {
        return this.client.databases.createIfNotExists({id: this.databaseId});
    }

    readDatabaseDefinition() {
        return this.client.database(this.databaseId).read();
    }

    deleteDatabase() {
        return this.client.database(this.databaseId).delete();
    }

    createCollectionIfNotExists() {
        return this.client.database(this.databaseId)
            .containers.createIfNotExists({id: this.collectionId});
    }

    readCollectionDefinition() {
        return this.client.database(this.databaseId)
            .container(this.collectionId).read();
    }

    deleteCollection() {
        return this.client.database(this.databaseId)
            .container(this.collectionId).delete();
    }

    get(itemId, partitionKey) {
        return this.client.database(this.databaseId)
            .container(this.collectionId).item(itemId, partitionKey).read();
    };

    find(sqlQuery, sqlParameters=[]) {
        const querySpec = {
            query: sqlQuery,
            parameters: sqlParameters
        };
        const options = {
            enableCrossPartitionQuery: true
        };
        return this.client.database(this.databaseId)
            .container(this.collectionId).items.query(querySpec, options).toArray();
    }

    insert(item) {
        return this.client.database(this.databaseId)
            .container(this.collectionId).items.create(item);
    };

    upsert(item) {
        return this.client.database(this.databaseId)
            .container(this.collectionId).items.upsert(item);
    };

    replace(item, partitionKey) {
        return this.client.database(this.databaseId)
            .container(this.collectionId).item(item.id, partitionKey).replace(item);
    };

    delete(itemId, partitionKey) {
        return this.client.database(this.databaseId)
            .container(this.collectionId).item(itemId, partitionKey).delete();
    }
}

module.exports = CosmosDB;