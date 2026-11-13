import { db } from "@/config/postgresInit";
import { usersTable } from "@/db/modals/Users";
import { encrypt, generateRSAKeys } from "@/utils/sodiumUtils";
import { hashString } from "@/utils/sodiumUtils";
import { DrizzleQueryError, eq } from "drizzle-orm";
import { randomBytes } from "node:crypto";

export const registerService = async (
  email: string,
  username: string,
  password: string,
) => {
  const isAlredyRegister = await isDuplicateEmail(email);
  if (isAlredyRegister) {
    return "Email Already Registered";
  }
  const { publicKey, privateKey } = generateRSAKeys();
  const encryptedPrivateKey = encrypt(privateKey.toString());
  const hashsPassword = await hashString(password);
  const uniqueId = randomBytes(32).toString("hex");

  let result;
  try {
    await db.transaction(async (t) => {
      result = await t
        .insert(usersTable)
        .values({
          username,
          email,
          password_hash: hashsPassword,
          public_key: publicKey.toBase64(),
          unique_id: uniqueId,
          private_key_encrypted: encryptedPrivateKey,
        })
        .returning({ username: usersTable.username, email: usersTable.email });
    });
    console.log("User Registration Successful...");
  } catch (error) {
    if (error instanceof DrizzleQueryError)
      console.error("Unable to Register user: ", error.message);
    return "Error " + error;
  }
  return result || "Error";
};

export const isDuplicateEmail = async (email: string) => {
  try {
    const users = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));
    if (users.length > 1) return true;
  } catch (error) {
    console.error("Unable to check does email exists");
  }
  return false;
};
