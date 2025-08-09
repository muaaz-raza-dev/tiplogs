import { ICreateAttModuleform } from "@/types/att_module";
import { Axios } from "./axios";

export async function CreateAttModuleformApi(data:ICreateAttModuleform) {
  const t = sessionStorage.getItem(process.env["NEXT_PUBLIC_ACCESS_TOKEN_KEY"]||"") ;
  const res = await Axios.post("/att/module/create", data, {
      headers: { Authorization: `Bearer ${t}` } 
    }) 
  return res.data
}


export async function GetAttModulesApi() {
  const t = sessionStorage.getItem(process.env["NEXT_PUBLIC_ACCESS_TOKEN_KEY"]||"") ;
  const res = await Axios.get<{payload:{name:string,description:string,frequency:"daily"|"custom";id:string}[]}>("/att/module",  {headers: { Authorization: `Bearer ${t}` } }) 
  return res.data
}


export async function EditAttModuleDetailsApi(data:{name:string,description:string,id:string,}) {
  const t = sessionStorage.getItem(process.env["NEXT_PUBLIC_ACCESS_TOKEN_KEY"]||"") ;
  const res = await Axios.put(`/att/module/edit/${data.id}`, {name:data.name,description:data.description}, {
      headers: { Authorization: `Bearer ${t}` } 
    }) 
  return res.data
}


interface User {
  full_name: string;
  username: string;
  id: string;
}

interface GroupPayload {
  group: string;
  users: User[];
}

interface ResponsePayload {
  payload:{groups_to_users: GroupPayload[],module:{name:string,description:string,created_at:string}};
}


export async function GetModuleGroupUsersApi(id:string) {
  const t = sessionStorage.getItem(process.env["NEXT_PUBLIC_ACCESS_TOKEN_KEY"]||"") ;
  const res = await Axios.get<ResponsePayload>(`/att/module/groups/users/${id}`, {headers: { Authorization: `Bearer ${t}` } }) 
  return res.data
}





export interface IUpdateAssignedGroupUsersAttModulePayload{
  group:string;
  users:string[]
}
export async function UpdateAssignedGroupUsersAttModuleApi(id:string,payload:IUpdateAssignedGroupUsersAttModulePayload) {
  const t = sessionStorage.getItem(process.env["NEXT_PUBLIC_ACCESS_TOKEN_KEY"]||"") ;
  const res = await Axios.put(`/att/module/assign/group/user/${id}`,payload, {headers: { Authorization: `Bearer ${t}` } }) 
  return res.data
}
