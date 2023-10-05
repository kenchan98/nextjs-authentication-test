import { MongoClient } from "mongodb/lib/mongo_client";
import { connectToDatabase } from "../../../lib/db";
import { hashPassword } from "../../../lib/auth";
//
//
export default async function signup(req, res) {
  if (req.method === "POST") {
    const data = req.body;
    const { email, password } = data;

    if (
      !email ||
      !email.includes("@") ||
      !password ||
      password.trim().length < 8
    ) {
      return res
        .status(422)
        .json({ message: "Invalid email or password less than 8 characters " });
    }
    // encrypt the password
    const hashedPassword = await hashPassword(password);
    const loginDetails = {
      email: data.email,
      password: hashedPassword,
      password_2: password,
    };
    // connect to mongodb
    const client = await connectToDatabase();
    const db = client.db();
    // check if eamil already exist
    const existingUser = await db.collection("login").findOne({ email: email });
    if (existingUser) {
      res.status(422).json({ message: " Email already existed! " });
      client.close();
      return;
    }
    //
    await db.collection("login").insertOne(loginDetails);
    //
    client.close();
    return res.status(201).json({
      message: "to mongoDB successful!@!",
      email: email,
      password: password,
    });
  }
}
