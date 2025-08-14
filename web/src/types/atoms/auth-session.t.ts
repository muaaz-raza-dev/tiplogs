import { Iuser } from "../users.t";

export enum AuthRole{
    USER = 'user',
    ADMIN = 'admin',
    MANAGER = 'manager',
}

export interface IAuthSession{
    isLoggedIn: boolean;
    user?: Iuser
}