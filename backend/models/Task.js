// backend/models/Task.js
const { getDb } = require('../db/mongo');
const { ObjectId } = require('mongodb');

async function createTask(task) {
  const db = getDb();
  return await db.collection('tasks').insertOne(task);
}

async function getTasksByUser(email) {
  const db = getDb();
  return await db.collection('tasks')
    .find({ $or: [{ owner: email }, { sharedWith: email }] })
    .sort({ createdAt: -1 })
    .toArray();
}

async function updateTask(id, data) {
  const db = getDb();
  return await db.collection('tasks').updateOne(
    { _id: new ObjectId(id) },
    { $set: data }
  );
}

async function deleteTask(id) {
  const db = getDb();
  return await db.collection('tasks').deleteOne({ _id: new ObjectId(id) });
}

async function shareTask(id, email) {
  const db = getDb();
  return await db.collection('tasks').updateOne(
    { _id: new ObjectId(id) },
    { $addToSet: { sharedWith: email } }
  );
}

module.exports = {
  createTask,
  getTasksByUser,
  updateTask,
  deleteTask,
  shareTask,
};
