import z, { email } from "zod";

export const loginSchema = z.object({
  // username: z
  //   .string()
  //   .min(4, "Username should be of at least 4 Charectores")
  //   .max(50, "Username can't have more than 50 Charectors"),
  email: z.email("Please Provide a Valid Email").trim(),
  password: z
    .string()
    .trim()
    .min(4, "Password should have at least 4 charectors")
    .max(18, "Password can't have more than 18 charectors"),
});

export const loginResponseSchema = z.object({});
