import { loginResponseSchema, loginSchema } from "@/schemes/login.schema";
import {
  registerResponseSchema,
  registerSchema,
} from "@/schemes/register.schema";
import { loginService } from "@/services/auth/login.service";
import { registerService } from "@/services/auth/register.service";
import { hashString } from "@/utils/sodiumUtils";
import { Hono } from "hono";
import { describeRoute, resolver, validator } from "hono-openapi";
import { json } from "zod";

const auth = new Hono();
auth.get("/", (c) => c.text("Auth"));
auth.post(
  "/register",
  describeRoute({
    description: "Registor User Details",
    responses: {
      200: {
        description: "User Registration Successful",
        content: {
          "text/plain": {
            schema: resolver(registerResponseSchema),
          },
        },
      },
      409: {
        description: "User Email is already Registered",
        content: {
          "application/json": {
            // schema:
          },
        },
      },
    },
  }),
  validator("json", registerSchema),
  async (c) => {
    const { username, email, password } = c.req.valid("json");
    const registerDetails = await registerService(email, username, password);
    console.log(registerDetails);

    return c.json(registerDetails);
  },
);
auth.post(
  "/login",
  describeRoute({
    description: "User Login",
    responses: {
      200: {
        description: "User Login Successful",
        content: {
          "application/json": {
            schema: resolver(loginResponseSchema),
          },
        },
      },
    },
  }),
  validator("json", loginSchema),
  async (c) => {
    const { email, password } = c.req.valid("json");

    const res = await loginService(email, password);
    return c.json(res);
  },
);

export default auth;
