import { pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: serial().primaryKey(),
  username: varchar({ length: 50 }).unique().notNull(),
  email: varchar({ length: 225 }).unique().notNull(),
  password_hash: varchar({ length: 225 }).notNull(),
  unique_id: varchar({ length: 64 }).notNull(),
  public_key: text().notNull(),
  private_key_encrypted: text(),
  last_seen: timestamp(),
  created_at: timestamp().defaultNow(),
  updated_at: timestamp().defaultNow(),
});
