import { MongoClient, MongoClientOptions } from "mongodb";
import { DB_CONF } from "../helpers/constant";

export let client: MongoClient;

export const connect = async () => {
    const options: MongoClientOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    };

    client = await MongoClient.connect(DB_CONF, options);
};
