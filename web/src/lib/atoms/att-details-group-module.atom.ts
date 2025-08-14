import { IattDetailsGroupModuleDailyAtom } from "@/types/atoms/att-details-group-module.t";
import {atom} from "jotai"

export const AttModuleGroupDetailsDailyAtom = atom<IattDetailsGroupModuleDailyAtom>(
    {
            group : "",
            module: "",
            date: "",

    }
);