export interface ImarkAttendaneAtom {
  general:{
      total_individuals: number;
      unmarked: number;
      att_date: Date|null;
      attendance_group_id:string
      status:"pending"|"complete",
      is_holiday:boolean;
    } ,
  module: {id:string,
    name: string;
    frequency: "daily" | "custom";
  };
  group: { name: string; id: string };
  
}

export interface ImarkAttendanceblock{
    individual:{full_name: string;father_name: string;grno: string;roll_no: string;photo: string;id:string};
    status: AttendanceStatus;
    reporting_time: string;
    att_note?: string;
  }

export type AttendanceStatus = "present" | "absent" | "late" | "leave"| "half_day" | "";
export const AttendanceStatusList = ["present" , "absent" , "late" , "leave", "half_day"]


