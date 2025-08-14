import { IusersListAtom } from '@/types/users.t';
import {atom} from "jotai"

export const UsersListingAtom = atom<IusersListAtom>(
  {
    users : {},
    count:0,
    total:0,
    filters : {
      input: "",
      role: "all",
      status: "active"
    }
}
);
