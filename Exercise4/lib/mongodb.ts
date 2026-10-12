import { MongoClient, type Db } from "mongodb";

const options = {};
type MongoCache = { client: MongoClient | null; promise: Promise<MongoClient> | null };
const globalForMongo = globalThis as typeof globalThis & { mongoCache?: MongoCache };
const cache = (globalForMongo.mongoCache ??= { client: null, promise: null });

export async function getDb(): Promise<Db> {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("Set MONGODB_URI in Exercise4/.env.local before starting the app.");

  if (!cache.client) {
    try {
      cache.promise ??= new MongoClient(uri, options).connect();
      cache.client = await cache.promise;
    } catch (error) {
      cache.promise = null;
      throw error;
    }
  }
  return cache.client.db(process.env.MONGODB_DB || "nextjs_exercise4");
}
