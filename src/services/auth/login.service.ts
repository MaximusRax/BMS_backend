import { db } from "@/config/postgresInit";
import { usersTable } from "@/db/modals/Users";
import { hashString, verifyPassword } from "@/utils/sodiumUtils";
import { and, eq } from "drizzle-orm";

export const loginService = async (email: string, password: string) => {
  const result = await db
    .select({ uId: usersTable.id, passwordHash: usersTable.password_hash })
    .from(usersTable)
    .where(eq(usersTable.email, email));
  // if (result.length < 1) {
  //   return "User Not found";
  // }
  const user = result[0];
  if (!verifyPassword(user.passwordHash, password)) return "User Not found";

  const hashPassword = await hashString(password);
  if (user.passwordHash !== hashPassword) {
    await db
      .update(usersTable)
      .set({ password_hash: hashPassword })
      .where(eq(usersTable.id, user.uId));
  }
  return getUserDetails(user.uId, hashPassword);
};

export const getUserDetails = async (id: number, hashPassword: string) => {
  return await db
    .select({
      uId: usersTable.unique_id,
      email: usersTable.email,
      privateKey: usersTable.private_key_encrypted,
    })
    .from(usersTable)
    .where(
      and(eq(usersTable.id, id), eq(usersTable.password_hash, hashPassword)),
    );
};
