import { z } from 'zod'

export const SignupAdminSchema = z.object({
  full_name: z.string().min(1, "Full name is required"),
  email: z.email("Invalid email address"),
  username: z.string().min(3, "Username is required").regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
  password: z.string().min(6, "Password must be at least 6 characters").regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^\s]{6,}$/
,    "Password must include uppercase, lowercase, number, and no spaces"

  ),
  phone: z.string().optional(),
  terms: z.boolean().refine(val => val, {
    message: "You must accept the terms and conditions",
  }),
})


export type ISignupAdminForm = z.infer<typeof SignupAdminSchema>
