import z from 'zod';

export enum UserRole {
    ADMIN = "admin",
    USER = "user",
    MANAGER = "manager",
}

export const user_roles = [ "admin", "user", "manager" ] as const;
export interface Iuser{
    full_name:string
    email:string
    username:string
    is_verified:boolean
    organization:string
    role: UserRole 
    created_at:string
    is_blocked:boolean
    id:string 
}

export const RegisterUserSchema = z.object({
  full_name: z.string().min(1, "Full name is required"),
  email: z.email("Invalid email address"),
  username: z.string().min(3, "Username must be greater than 3 characters").regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
  password: z.string().min(8, "Password must be at least 8 characters").regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^\s]{6,}$/
,    "Password must include uppercase, lowercase, number, and no spaces"

  ),
  role: z.enum(user_roles.slice(1), {error:"Role must be either 'manager' or 'user'"})
})

export type IRegisterUserForm = z.infer<typeof RegisterUserSchema>

export interface IusersListAtom{
    users: Iuser[];
    count: number;
    total:number
}