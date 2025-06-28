// backend/utils/session.js
const { getDb } = require('../db/mongo');
const { parseCookies } = require('./cookie');

async function getUserFromSession(req) {
  const cookies = parseCookies(req);
  const token = cookies.session_token;
  if (!token) return null;

  const db = getDb();
  const session = await db.collection('sessions').findOne({ token });
  if (!session) return null;

  const user = await db.collection('users').findOne({ email: session.userEmail });
  return user;
}

module.exports = { getUserFromSession };
