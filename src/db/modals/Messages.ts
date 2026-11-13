import {
  boolean,
  bytea,
  index,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { usersTable } from "./Users";

export const contentType = pgEnum("content_type", [
  "TEXT",
  "IMAGE",
  "VIDEO",
  "AUDIO",
  "DOCUMENT",
]);

export const status = pgEnum("status", [
  "SENT",
  "DELIVERED",
  "READ",
  "QUEUED",
  "FAILED",
]);

export const messagesTable = pgTable(
  "messages",
  {
    id: serial().primaryKey(),
    sender_id: integer().references(() => usersTable.id, {
      onDelete: "cascade",
    }),
    receiver_id: integer().references(() => usersTable.id, {
      onDelete: "cascade",
    }),
    content_type: contentType().notNull(),
    content: text(),
    file_data: bytea(),
    status: status().default("SENT"),
    is_encrypted: boolean().default(true),
    created_at: timestamp().defaultNow(),
    delivered_at: timestamp(),
    read_at: timestamp(),
    retry_count: integer().default(0),
    next_retry_at: timestamp(),
  },
  (t) => [
    index("idx_messages_receiver_status").on(t.receiver_id, t.status),
    index("idx_messages_created_at").on(t.created_at),
  ],
);
