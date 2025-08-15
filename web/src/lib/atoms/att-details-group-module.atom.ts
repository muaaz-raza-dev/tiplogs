import { IattDetailsOverviewDoc, IattDetailsOverviewFilters } from "@/types/atoms/att-details-group-module.t";
import {atom} from "jotai"

export const AttOverviewDailyFiltersAtom = atom<IattDetailsOverviewFilters>(
    {
            group : "",
            module: "",
            start_date: "",

    }
);

export const AttOverviewDailyDocsAtom = atom<IattDetailsOverviewDoc[]>([]);