import { z } from "zod";

export const userNameSchema = z
  .string()
  .trim()
  .min(3, "Username must be at least 3 characters")
  .max(20, "Username must be at most 20 characters")
  .regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers, and underscores are allowed")
  .refine((val) => !/^\d/.test(val), {
    message: "Username cannot start with a number",
  });

const formSchema = z.object({
  fname: z
    .string({ required_error: "Name is required" })
    .min(1, { message: "Name is required" }),

  userName: userNameSchema,

  email: z
    .string({ required_error: "Email is required" })
    .min(1, { message: "Email is required" })
    .email({ message: "Please enter a valid email address" }),
  password: z
    .string({ required_error: "Password is required" })
    .min(1, { message: "Password is required" })
    .min(8, { message: "passwords must be at least 8 characters long" })
    .max(64, { message: "passwords must be at most 64 characters long" })
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      {
        message:
          "password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character",
      }
    ),

  country: z
    .string({ required_error: "Country is required" })
    .min(1, { message: "Country is required" }),

})




export default formSchema;