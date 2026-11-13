import { Hono } from "hono";

const user = new Hono();
user.get("/", (c) => c.text("UserPage"));

export default user;
