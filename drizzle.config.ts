import { defineConfig } from "drizzle-kit";
import { config } from "dotenv";

config();
export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/modals/",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
