import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function getDb() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }
  
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

// Extracts the native MongoDB driver database object from the Mongoose connection
export async function getNativeDb() {
  const mongooseInstance = await getDb();
  
  // Wait for the connection to be fully established before accessing the native db
  if (mongooseInstance.connection.readyState !== 1) {
    await new Promise(resolve => mongooseInstance.connection.once('open', resolve));
  }
  
  return mongooseInstance.connection.db;
}
