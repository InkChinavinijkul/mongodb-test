import { Router, Request, Response } from "express";
import { database } from "./database";
import axios from "axios";
import express = require("express");
const app = express();

export const router: Router = Router();

router
    .route("/ping")
    .get((_req: Request, res: Response) => res.send(`OK @ ${new Date()}`));

app.get("/prices", async (req, res) => {
    try {
        const dbHandle = database.dbHandle;
        const collection = dbHandle.collection("prices");
        const result = await collection.find({});
        res.send(result);
    } catch (error) {
        throw new Error(error);
    }
});

app.get("/averagePrices", async (req, res) => {
    try {
        const dbHandle = database.dbHandle;
        const collection = dbHandle.collection("prices");
        const result = await collection
            .aggregate([
                {
                    $group: {
                        _id: "$symbol",
                        averagePrice: { $avg: "$price" },
                    },
                },
            ])
            .toArray();

        const enchanced = result.map(async (item) => {
            const fetchedData = await axios.get(
                `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${item.symbol}`
            );
            const currentQuote = fetchedData.data;

            return { ...item, currentPrice: currentQuote.regularMarketPrice };
        });

        res.json(enchanced);
    } catch (error) {
        throw new Error(error);
    }
});
