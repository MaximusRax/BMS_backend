import {
  bytea,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { usersTable } from "./Users";

export const userProfilesTable = pgTable("user_profiles", {
  id: serial().primaryKey(),
  user_id: integer("user_id").references(() => usersTable.id, {
    onDelete: "cascade",
  }),
  display_name: varchar({ length: 100 }),
  avatar: bytea(),
  bio: text(),
  created_at: timestamp().defaultNow(),
  updated_at: timestamp().defaultNow(),
});
