const { MongoClient } = require('mongodb');
require('dotenv').config();

const url = process.env.DB_STRING;

MongoClient.connect(url)
    .then(async (client) => {
        console.log('Connected to database');

        const db = client.db('LockNLearn');

        // List the names of all collections in the database (test)
        const collectionNames = await db.listCollections().toArray();
        console.log('Collections:', collectionNames.map((c) => c.name));
    })
    .catch((error) => console.error(error));
