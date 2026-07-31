import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGODB_URI;

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function getDb(): Promise<Db | null> {
  if (!uri) return null;
  if (cachedClient && cachedDb) return cachedDb;

  try {
    const client = new MongoClient(uri);
    await client.connect();
    cachedClient = client;
    cachedDb = client.db();
    return cachedDb;
  } catch (err) {
    console.error("MongoDB connection failed, falling back to in-memory store:", err);
    return null;
  }
}
