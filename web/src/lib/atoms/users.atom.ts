import { IusersListAtom } from '@/types/users';
import {atom} from "jotai"

export const UsersListingAtom = atom<IusersListAtom>(
  {
    users : [],
    count:1,
    total:0
}
);
