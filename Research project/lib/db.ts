import mongoose from "mongoose";

type MongooseCache = { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };
const globalWithMongoose = globalThis as typeof globalThis & { mongooseCache?: MongooseCache };
const cache = (globalWithMongoose.mongooseCache ??= { conn: null, promise: null });

export default async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("Please set MONGODB_URI in .env.local");

  if (cache.conn) return cache.conn;
  try {
    cache.promise ??= mongoose.connect(uri);
    cache.conn = await cache.promise;
    return cache.conn;
  } catch (error) {
    cache.promise = null;
    throw error;
  }
}
