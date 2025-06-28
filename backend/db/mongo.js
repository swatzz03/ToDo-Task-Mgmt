// backend/db/mongo.js
const { MongoClient } = require('mongodb');
require('dotenv').config();

const client = new MongoClient(process.env.MONGO_URI);
let db = null;

async function connectToMongo() {
  await client.connect();
  db = client.db(); // default DB from connection string
  console.log('✅ Connected to MongoDB Atlas');
}

function getDb() {
  if (!db) throw new Error("DB not initialized");
  return db;
}

module.exports = { connectToMongo, getDb };
