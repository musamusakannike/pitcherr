import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Global is used here to maintain a cached connection across hot reloads in development
declare global {
  var mongooseCache: MongooseCache | undefined;
}

let cached = global.mongooseCache;

if (!cached) {
  cached = global.mongooseCache = { conn: null, promise: null };
}

export async function connectToDatabase() {
  const safeCached = cached!;
  
  if (safeCached.conn) {
    return safeCached.conn;
  }

  if (!safeCached.promise) {
    const opts = {
      bufferCommands: false,
    };

    safeCached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongooseInstance) => {
      return mongooseInstance;
    });
  }

  try {
    safeCached.conn = await safeCached.promise;
  } catch (e) {
    safeCached.promise = null;
    throw e;
  }

  return safeCached.conn;
}
