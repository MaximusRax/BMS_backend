import { Hono } from "hono";
import auth from "./auth";
import user from "./users";
import { openAPIRouteHandler } from "hono-openapi";
import { swaggerUI } from "@hono/swagger-ui";

const app = new Hono().basePath("/api");
app.route("/auth", auth);
app.route("/user", user);
app
  .get(
    "/openapi",
    openAPIRouteHandler(app, {
      documentation: {
        openapi: "3.0.0",
        info: {
          title: "BNS",
          version: "0.1",
          description: "Secure Private Messaging Service",
        },
        servers: [
          { url: "http://localhost:3000", description: "Local Server" },
        ],
      },
    }),
  )
  .get(
    "/swagger-ui",
    swaggerUI({
      url: "/api/openapi",
    }),
  );
export default app;
