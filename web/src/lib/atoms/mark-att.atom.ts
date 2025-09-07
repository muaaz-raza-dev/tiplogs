import { ImarkAttendanceblock, ImarkAttendaneAtom } from "@/types/atoms/mark-attendance.t";
import {atom} from "jotai"

export const MarkAttendanceAtom = atom<ImarkAttendaneAtom>(
{
    general: {
        attendance_group_id:"",
        total_individuals: 0,
        unmarked: 0,
        att_date: null,
        status:"pending",
        is_holiday:false,
    },
    module: {
        id:"",
        name: "",
        frequency: "daily", 
    },
    group: {
        name: "",
        id: "",
    },
    }  
);

export const MarkAttendanceListAtom = atom<ImarkAttendanceblock[]>([]);