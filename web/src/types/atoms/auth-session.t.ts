import { Iuser } from "../user.t";

export enum AuthRole{
    USER = 'user',
    ADMIN = 'admin',
    MANAGER = 'manager',
}

export interface IAuthSession{
    accessToken: string|null;
    isLoggedIn: boolean;
    user?: Iuser
}