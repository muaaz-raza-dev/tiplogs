import { AttendanceStatus } from "./atoms/mark-attendance.t";

export interface IattDetailedViewPayload {
  attendances: IattDetailedViewPayloadAttendance[];
  overview: IattDetailedViewPayloadOverview;
  attendance_meta: IattDetailedViewPayloadAttendanceMeta;
  is_attendance: boolean;
  is_taken: boolean;
}
export interface IattDetailedViewPayloadOverview {
    total:number;
    present: number;
    absent: number;
    leave: number;
    late: number;
    half: number;
}

export interface IattDetailedViewPayloadAttendanceMeta{
    taken_by:{username:string;full_name:string;id:string,photo:string};
    created_at:string;
    updated_at:string;
    att_group_id:string;
    att_base_id:string;
}

export interface IattDetailedViewPayloadAttendance {
  individual: {
    full_name: string;
    father_name: string;
    grno: string;
    roll_no: string;
    id: string;
  };
  status: Omit<AttendanceStatus, "">;
  reporting_time: string;
  att_note:string;
  }
