import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import { connectToDatabase } from "../../../lib/db";
import { verifyPassword } from "../../../lib/auth";

export default NextAuth({
  session: {
    jwt: true,
  },
  providers: [
    Providers.Credentials({
      async authorize(credentials) {
        const client = await connectToDatabase();
        const collection = client.db().collection("login");
        const user = await collection.findOne({ email: credentials.email });
        // check if such user email in the collection
        if (!user) {
          throw new Error("No user found!");
        }
        // check if the hashed password is matched
        const isPasswordValid = await verifyPassword(
          credentials.password,
          user.password
        );
        if (!isPasswordValid) {
          throw new Error("Incorrect password!!");
        }
        //
        console.log(user, isPasswordValid);
        client.close();
        return { email: user.email };
      },
    }),
  ],
});
