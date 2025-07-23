export enum UserRole {
    ADMIN = "admin",
    USER = "user",
    MANAGER = "manager",
}

export interface Iuser{
    full_name:string
    email:string
    username:string
    is_verified:boolean
    organization:string
    role: UserRole
}