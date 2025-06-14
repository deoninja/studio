import { MongoClient } from 'mongodb';

// MongoDB connection URI - user should replace with their actual URI
const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";
const client = new MongoClient(uri);
const dbName = 'symptom_tracker';

let db;

async function connect() {
  if (!db) {
    await client.connect();
    db = client.db(dbName);
    // Create collection if it doesn't exist
    await db.collection('symptoms').createIndex({ _id: 1 }, { unique: true });
  }
  return db;
}

export async function getSymptoms() {
  const db = await connect();
  const symptoms = await db.collection('symptoms').find().sort({ date: -1 }).toArray();
  // Map _id to id for compatibility with existing code
  return symptoms.map(({ _id, ...rest }) => ({ id: _id, ...rest }));
}

export async function addSymptom(symptom) {
  const db = await connect();
  const { id, ...data } = symptom;
  const result = await db.collection('symptoms').insertOne({ ...data, _id: id });
  return result.insertedId;
}

export async function deleteSymptom(id) {
  const db = await connect();
  await db.collection('symptoms').deleteOne({ _id: id });
}

export default client;
