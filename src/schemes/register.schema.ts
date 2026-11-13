import { password } from "bun";
import z, { email } from "zod";

export const registerSchema = z.object({
  username: z
    .string()
    .min(4, "username should be of at least 4 charectors")
    .max(50, "username should be less than 50 charectors")
    .nonempty("Username is required"),
  email: z
    .email("Please Enter Valid Email address")
    .max(225, "Email address should be less 255 charectors")
    .nonempty("Email is required"),
  password: z
    .string()
    .min(4, "Password should have at least 4 charectors")
    .max(18, "Password can't have more than 18 charectors")
    .trim(),
});

export const registerResponseSchema = z.string();
