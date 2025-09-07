import { AttendanceStatus } from "@/types/atoms/mark-attendance.t";
import { IattDetailedViewPayload } from "@/types/IdetailedAttendanceView";
import {atom} from "jotai"

interface IattViewEachAtomFilterState {
group:string;
module:string;
att_date:string;
status_selected:AttendanceStatus;
is_fetched:boolean;
}

export const defaultAttViewFilters : IattViewEachAtomFilterState = {
    group:"",
    module:"",
    att_date:"",
    status_selected:"",
    is_fetched:false,
}
export const AttViewEachFilterAtom = atom<IattViewEachAtomFilterState>(
    {
    group:"",
    module:"",
    att_date:"",
    status_selected:"",
    is_fetched:false,
    }
);

export const defaultAttendanceDetailedView : IattDetailedViewPayload = {
    attendances:[],
    overview:{present:0,absent:0,leave:0,late:0,half:0,total:0},
    attendance_meta:{
        taken_by:{username:"",full_name:"",id:"",photo:"",},
        created_at:"",
        updated_at:"",
        att_group_id:"",
        att_base_id:""
    },
    is_attendance:false,
    is_taken:false
}

export const AttViewEachListAtom = atom<IattDetailedViewPayload>(defaultAttendanceDetailedView)
