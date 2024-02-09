import { connectToMongoDB, createCollection } from "./database";
import { app } from "./express";

async function init() {
    await connectToMongoDB();
    app.listen(3000);
    console.log(`Listening on port 3000`);
}

init();
