import { IGroupListingAtom } from '@/types/group.t';
import {atom} from "jotai"

export const GroupsListingAtom = atom<IGroupListingAtom>(
  {
    groups : [],
    filtered_groups:[],
    count:0,
    total:0,
    filters : {
      input: "",
    }
}
);
