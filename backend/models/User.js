// backend/models/User.js
const { getDb } = require('../db/mongo');

async function getUserByEmail(email) {
  const db = getDb();
  return await db.collection('users').findOne({ email });
}

async function upsertUser(profile) {
  const db = getDb();
  return await db.collection('users').findOneAndUpdate(
    { email: profile.email },
    { $set: { name: profile.name, picture: profile.picture } },
    { upsert: true, returnDocument: 'after' }
  );
}

module.exports = { getUserByEmail, upsertUser };
