import { IgroupUserAssignmentDialogAtomState } from "@/types/att_module.t";
import {atom} from "jotai"

export const AttModuleGroupUserAssignmentAtom = atom<IgroupUserAssignmentDialogAtomState>(
    {
    selected_group:"",
    group_selection_disabled:true,
    selected_users:[],
    open_dialog:false
    }
);