import { IindividualListingAtom, IinvidualRegistrationRequestsListingAtom } from '@/types/individual.t';
import {atom} from "jotai"

export const individualListingAtom = atom<IindividualListingAtom>(
  {
    results : {},
    count:0,
    total:0,
    filters : {
      q: "",
      group: "all",
    }
}
);


export const invidualRegistrationRequestsListingAtom = atom<IinvidualRegistrationRequestsListingAtom>({
  results : {},
    count:0,
    total:0,
    filters : {
      q: "",
      status: "all",
    }
})