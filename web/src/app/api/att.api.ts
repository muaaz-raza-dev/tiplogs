import { IattDetailsOverviewDoc } from "@/types/atoms/att-details-group-module.t";
import { Axios } from "./axios";
import { IattDetailedViewPayload } from "@/types/IdetailedAttendanceView";
interface IGetAttModulesUserSpecificPayload{
    payload:{
        modules:{name:string,description:string,frequency:"daily"|"custom",id:string}[]
    }
}
export async function GetAttendanceModulesUserSpecific() {
  const t = sessionStorage.getItem(process.env["NEXT_PUBLIC_ACCESS_TOKEN_KEY"]||"") ;
  const res = await Axios.get<IGetAttModulesUserSpecificPayload>("/attendance/user/modules", {headers: { Authorization: `Bearer ${t}` } }) 
  return res.data
}

interface IGetAttGroupUserSpecificPayload{
    payload:{
        groups:{name:string,total:number,id:string}[]
    }
}
export async function GetAttendanceModuleSpecificGroupsApi(module:string) {
  const t = sessionStorage.getItem(process.env["NEXT_PUBLIC_ACCESS_TOKEN_KEY"]||"") ;
  const res = await Axios.get<IGetAttGroupUserSpecificPayload>(`/attendance/user/groups/${module}`, {headers: { Authorization: `Bearer ${t}` } }) 
  return res.data
}

interface IattendanceModuleGroupPairsApi{
  groups:{[key:string]:{name:"string","id":string}[]};
  modules:{id:string,name:string,frequency:"custom"|"daily"}[]
}

export async function GetAttendanceModuleGroupPairsApi() {
  const t = sessionStorage.getItem(process.env["NEXT_PUBLIC_ACCESS_TOKEN_KEY"]||"") ;
  const res = await Axios.get<{payload:IattendanceModuleGroupPairsApi}>(`/attendance/user/module-groups/pairs`, {headers: { Authorization: `Bearer ${t}` } }) 
  return res.data
}


export interface IweeklyAttendanceRequestPayload {
  module: string;       // MongoDB ObjectId as string
  group: string;        // MongoDB ObjectId as string
  start_date: string;   // "YYYY-MM-DD"
  end_date?: string;    // Optional if you compute on backend
}

export async function GetAttendanceWeeklyOverviewApi(payload:IweeklyAttendanceRequestPayload) {
  const t = sessionStorage.getItem(process.env["NEXT_PUBLIC_ACCESS_TOKEN_KEY"]||"") ;
  const res = await Axios.post<{payload:IattDetailsOverviewDoc[]}>(`/attendance/user/week/record`,payload, {headers: { Authorization: `Bearer ${t}` } }) 
  return res.data
}

export async function GetScheduledCustomAttendance(module:string) {
  const t = sessionStorage.getItem(process.env["NEXT_PUBLIC_ACCESS_TOKEN_KEY"]||"") ;
  const res = await Axios.get<{payload:{docs:{att_date:string;id:string;created_at:string}[],total:number}}>(`/attendance/scheduled/custom/${module}`, {headers: { Authorization: `Bearer ${t}` } }) 
  return res.data
}

export async function ScheduleCustomAttendanceApi(module:string,att_date:string,att_base?:string,){
const t = sessionStorage.getItem(process.env["NEXT_PUBLIC_ACCESS_TOKEN_KEY"]||"") ;
  const res = await Axios.post<{payload:{att_date:string;id:string;created_at:string}}>(`/attendance/schedule/custom/${module}${att_base ? `?base=${att_base}`:""}`,{att_date}, {headers: { Authorization: `Bearer ${t}` } }) 
  return res.data
}

export async function DeleteScheduleCustomAttendanceApi(att_base:string){
const t = sessionStorage.getItem(process.env["NEXT_PUBLIC_ACCESS_TOKEN_KEY"]||"") ;
  const res = await Axios.delete(`/attendance/schedule/custom/${att_base}/delete`,{headers: { Authorization: `Bearer ${t}` } }) 
  return res.data
}


export async function FetchEachAttendanceDetailedViewApi(payload:{module:string,group:string,att_date:string}) {
  const t = sessionStorage.getItem(process.env["NEXT_PUBLIC_ACCESS_TOKEN_KEY"]||"") ;
  const res = await Axios.post<{payload:IattDetailedViewPayload,message:string}>(`/attendance/view/detailed`, payload,{headers: { Authorization: `Bearer ${t}` } }) 
  return res.data
}