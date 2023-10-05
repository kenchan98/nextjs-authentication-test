import { MongoClient } from "mongodb/lib/mongo_client";

export async function connectToDatabase() {
  const client = await MongoClient.connect(
    "mongodb+srv://kenchan98:AI1MfqVhb1Pa300X@kenfirstcluster.jhyiwmn.mongodb.net/testing?retryWrites=true&w=majority"
  );
  return client;
}
