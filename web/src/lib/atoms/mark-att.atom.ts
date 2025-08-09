import { ImarkAttendanceblock, ImarkAttendaneAtom } from "@/types/atoms/mark-attendance";
import {atom} from "jotai"

export const MarkAttendanceAtom = atom<ImarkAttendaneAtom>(
{
    general: {
        attendance_group_id:"",
        total_individuals: 0,
        unmarked: 0,
        att_date: new Date(),
        status:"pending"
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