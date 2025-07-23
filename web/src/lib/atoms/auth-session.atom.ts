import { IAuthSession } from '@/types/atoms/auth-session.t';
import {atom} from "jotai"
import { atomWithStorage } from 'jotai/utils';

export const AuthSession = atom<IAuthSession>(
  {
    accessToken: null,
    isLoggedIn: false,
}
);

export const UserVerificationAttempts = atomWithStorage<number>("tp_vl", 0);