import { getSession } from "next-auth/client";
import { connectToDatabase } from "../../../lib/db";
import { hashPassword, verifyPassword } from "../../../lib/auth";
export default async function updatePassword(req, res) {
  // get the session object
  const session = await getSession({ req: req });
  if (req.method === "PATCH") {
    /*console.log(" ");
    console.log("-------------");
    console.log(session);*/
    //
    const enteredPasswordOld = req.body.passwordOld;
    const enteredPasswordNew = req.body.passwordNew;
    const client = await connectToDatabase();
    // get the login details from MongoDB
    const loginDetails = await client
      .db()
      .collection("login")
      .findOne({ email: session.user.email });
    // verify the current entered password matches the hashedpassword on MongoDB
    const isPasswordMatched = await verifyPassword(
      enteredPasswordOld,
      loginDetails.password
    );
    /*console.log("isPasswordMatched--------");
    console.log(isPasswordMatched);
    console.log("enteredPasswordOld : ", enteredPasswordOld);
    console.log("password on mongoDB : ", loginDetails.password_2);*/
    // if matches then this is the right user/login so updates the password to new one
    if (isPasswordMatched) {
      const newhashedPassword = await hashPassword(enteredPasswordNew);
      await client
        .db()
        .collection("login")
        .updateOne(
          { email: session.user.email },
          {
            $set: {
              password: newhashedPassword,
              password_2: enteredPasswordNew,
            },
          }
        );
    } else {
      client.close();
      return res.status(422).json({ message: "Password not correct!" });
    }
    client.close();
  }
  //
  //
  return res.status(200).json({ message: "Password updated!!" });
}
