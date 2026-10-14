// import {mongoclient} from "mongodb"

const uri  = process.env.Mongo_URI || "mongodb://127.0.0.1:27017/protfolio";

if (!uri) {
  throw new Error("Missing MONGODB_URI in .env.local");
}

const options = {};

