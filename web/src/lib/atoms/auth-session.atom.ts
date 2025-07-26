import { IAuthSession } from '@/types/atoms/auth-session.t';
import {atom} from "jotai"
import { atomWithStorage } from 'jotai/utils';

export const AuthSession = atom<IAuthSession>(
  {
    isLoggedIn: false,
}
);


export const userAccessTokenAtom = atomWithStorage<string>(process.env["NEXT_PUBLIC_ACESS_TOKEN_KEY"]||'tl_accesstoken', "", {
  getItem: (key) => {
    const stored = sessionStorage.getItem(key);
    return stored ? stored : "";
  },
  setItem: (key, value) => {
    sessionStorage.setItem(key,value);
  },
  removeItem: (key) => {
    sessionStorage.removeItem(key);
  }
});


export const UserVerificationAttempts = atomWithStorage<number>("tp_vl", 0);