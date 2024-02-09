import { Db, MongoClient } from "mongodb";
import { quotes } from "./quotes";

export interface IInitCollection {
    symbol: string;
    companyName: string;
    primaryExchange: string;
    sector: string;
    price: number;
    priceDate: string;
}

const MONGODB_URI =
    "mongodb+srv://cchinavinijkul:VHm9CWrXn7YJrkR5@ssandc.ldmwot3.mongodb.net/?retryWrites=true&w=majority";
const DATABASE_NAME = "interview";

export let database: {
    dbClient: MongoClient;
    dbHandle: Db;
};

export async function connectToMongoDB() {
    try {
        const dbClient = await MongoClient.connect(MONGODB_URI, {
            useNewUrlParser: true,
        });
        // const dbClient = await MongoClient.connect(MONGODB_URI);
        console.log("Successfully connected to server " + MONGODB_URI);
        database = {
            dbClient,
            dbHandle: dbClient.db(DATABASE_NAME),
        };

        // create database and collection from quotes.ts
        const db = database.dbHandle;
        const pricesCollection = db.collection("prices");
        await createCollection(pricesCollection, quotes);
    } catch (error) {
        console.log("Error creating database connection: " + error);
        throw error;
    }
}

export async function createCollection(collection, data: IInitCollection[]) {
    await collection.insert(data);
}
