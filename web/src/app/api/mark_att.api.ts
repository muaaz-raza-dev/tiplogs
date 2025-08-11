import { ImarkAttendanceblock } from "@/types/atoms/mark-attendance";
import { Axios } from "./axios";
interface IMetaMarkAttendaceResponse{
    payload:{
        group:{name:string,id:string};
        module:{name:string,id:string,frequency:"daily"|"custom"};
        total_individuals:number;
        individuals:{id:string ;full_name:string,father_name:string;photo:string;roll_no:string;grno:string}[]
    }
}
export async function GetMetaAttendanceInfo(module:string,group:string) {
  const t = sessionStorage.getItem(process.env["NEXT_PUBLIC_ACCESS_TOKEN_KEY"]||"") ;
  const res = await Axios.get<IMetaMarkAttendaceResponse>(`/att/mark/meta/${module}/${group}`, {headers: { Authorization: `Bearer ${t}` } }) 
  return res.data
}

interface IvalidateDateAndIdPayload{
  payload:{status:"pending"|"complete",attendance_group:string;
    date:string

  }
  message:string;
}
export async function ValidateDateAndIdApi(module:string,group:string,payload:{date:string}) {
  const t = sessionStorage.getItem(process.env["NEXT_PUBLIC_ACCESS_TOKEN_KEY"]||"") ;
  const res = await Axios.post<IvalidateDateAndIdPayload>(`/att/mark/data/${module}/${group}`,payload, {headers: { Authorization: `Bearer ${t}` } }) 
  return res.data
}
type Override<T, R> = Omit<T, keyof R> & R;
type Payload = Override<ImarkAttendanceblock, { individual: string }>;

export async function MarkAttendanceApi(id:string,payload:Payload[]) {
  const t = sessionStorage.getItem(process.env["NEXT_PUBLIC_ACCESS_TOKEN_KEY"]||"") ;
  const res = await Axios.post(`/att/mark/${id}`,{attendance:payload}, {headers: { Authorization: `Bearer ${t}` } }) 
  return res.data
}
