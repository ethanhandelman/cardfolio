const { MongoClient } = require('mongodb');
require('dotenv').config();

const { MONGO_USER, MONGO_PWD, MONGO_CLUSTER, DB_NAME } = process.env;

// Connection URI
const uri = `mongodb+srv://${MONGO_USER}:${MONGO_PWD}@${MONGO_CLUSTER}/?retryWrites=true&w=majority`;

// Create MongoDB client
const client = new MongoClient(uri);

// Database and collection references
let db;
let usersCollection;

async function connectToDB() {
  try {
    // Connect to the MongoDB cluster
    await client.connect();
    console.log('Connected to MongoDB');

    // Get database reference
    db = client.db(DB_NAME);
    
    // Get collections
    const { USERS_COLLECTION_NAME } = process.env;
    usersCollection = db.collection(USERS_COLLECTION_NAME);
    
    return {
      db,
      collections: {
        users: usersCollection
      }
    };
  } catch (err) {
    console.error('Error connecting to database:', err);
    process.exit(1);
  }
}

// Function to get the database instance
function getDB() {
  if (!db) {
    throw new Error('Database not initialized. Call connectToDB first.');
  }
  return db;
}

// Function to get the users collection
function getUsersCollection() {
  if (!usersCollection) {
    throw new Error('Users collection not initialized. Call connectToDB first.');
  }
  return usersCollection;
}

module.exports = {
  connectToDB,
  getDB,
  getUsersCollection,
  closeConnection: () => client.close()
};