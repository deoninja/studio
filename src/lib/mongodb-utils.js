import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";
const client = new MongoClient(uri);
const dbName = 'symptom_tracker';

let db;

async function connect() {
  if (!db) {
    await client.connect();
    db = client.db(dbName);
    // Create collections if they don't exist
    await db.collection('reminders').createIndex({ _id: 1 }, { unique: true });
    await db.collection('messages').createIndex({ _id: 1 }, { unique: true });
    await db.collection('mood_entries').createIndex({ _id: 1 }, { unique: true });
    await db.collection('profiles').createIndex({ _id: 1 }, { unique: true });
    await db.collection('settings').createIndex({ userId: 1 }, { unique: true });
    await db.collection('medications').createIndex({ _id: 1 }, { unique: true });
    await db.collection('appointments').createIndex({ _id: 1 }, { unique: true });
  }
  return db;
}

// Medication operations
export async function getMedications(userId) {
  const db = await connect();
  const medications = await db.collection('medications').find({ userId }).sort({ name: 1 }).toArray();
  return medications.map(({ _id, ...rest }) => ({ id: _id, ...rest }));
}

export async function createMedication(medication) {
  const db = await connect();
  const { id, ...data } = medication;
  const result = await db.collection('medications').insertOne({ ...data, _id: id });
  return result.insertedId;
}

export async function deleteMedication(id) {
  const db = await connect();
  await db.collection('medications').deleteOne({ _id: id });
}

// Appointment operations
export async function getAppointments(userId) {
  const db = await connect();
  const appointments = await db.collection('appointments').find({ userId }).sort({ date: 1 }).toArray();
  return appointments.map(({ _id, ...rest }) => ({ id: _id, ...rest }));
}

export async function createAppointment(appointment) {
  const db = await connect();
  const { id, ...data } = appointment;
  const result = await db.collection('appointments').insertOne({ ...data, _id: id });
  return result.insertedId;
}

export async function deleteAppointment(id) {
  const db = await connect();
  await db.collection('appointments').deleteOne({ _id: id });
}

// Reminder operations
export async function getReminders(userId) {
  const db = await connect();
  const reminders = await db.collection('reminders').find({ userId }).sort({ date: 1 }).toArray();
  return reminders.map(({ _id, ...rest }) => ({ id: _id, ...rest }));
}

export async function createReminder(reminder) {
  const db = await connect();
  const { id, ...data } = reminder;
  const result = await db.collection('reminders').insertOne({ ...data, _id: id });
  return result.insertedId;
}

export async function deleteReminder(id) {
  const db = await connect();
  await db.collection('reminders').deleteOne({ _id: id });
}

// Message operations
export async function getMessages(userId) {
  const db = await connect();
  const messages = await db.collection('messages').find({ userId }).sort({ timestamp: -1 }).toArray();
  return messages.map(({ _id, ...rest }) => ({ id: _id, ...rest }));
}

export async function createMessage(message) {
  const db = await connect();
  const { id, ...data } = message;
  const result = await db.collection('messages').insertOne({ ...data, _id: id });
  return result.insertedId;
}

// Mood journal operations
export async function getMoodEntries(userId) {
  const db = await connect();
  const entries = await db.collection('mood_entries').find({ userId }).sort({ date: -1 }).toArray();
  return entries.map(({ _id, ...rest }) => ({ id: _id, ...rest }));
}

export async function createMoodEntry(entry) {
  const db = await connect();
  const { id, ...data } = entry;
  const result = await db.collection('mood_entries').insertOne({ ...data, _id: id });
  return result.insertedId;
}

// Profile operations
export async function getProfile(userId) {
  const db = await connect();
  return db.collection('profiles').findOne({ userId });
}

export async function updateProfile(userId, profile) {
  const db = await connect();
  await db.collection('profiles').updateOne(
    { userId },
    { $set: profile },
    { upsert: true }
  );
}

// Settings operations
export async function getSettings(userId) {
  const db = await connect();
  return db.collection('settings').findOne({ userId });
}

export async function updateSettings(userId, settings) {
  const db = await connect();
  await db.collection('settings').updateOne(
    { userId },
    { $set: settings },
    { upsert: true }
  );
}

export default client;
