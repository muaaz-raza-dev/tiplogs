import { IRegisterUserForm } from "@/types/users";
import { Axios } from "./axios";
import { IgeneralAuthResponse } from "@/types/auth.t";

export async function registerUserbyAdminApi(data: IRegisterUserForm) {
  const t = sessionStorage.getItem(process.env["NEXT_PUBLIC_ACCESS_TOKEN_KEY"]||"") ;
  const res = await Axios.post<IgeneralAuthResponse>("/user/register/manual", data, 
    {
      headers:{Authorization: `Bearer ${t}`}
    }
  ); 
  return res.data
}

export interface IGetAllUsersPayload {
  count: number;
  input: string;
  role: string;
  status: string;
}

export async function getAllUsersApi(payload:IGetAllUsersPayload, ) {
  const t = sessionStorage.getItem(process.env["NEXT_PUBLIC_ACCESS_TOKEN_KEY"]||"") ;
  const res = await Axios.post(`/user/users`,
     payload,
    {
      headers: { Authorization: `Bearer ${t}` } 
    })
  return res.data;

}

export async function ToggleBlockUserApi(user_id:string, ) {
  const t = sessionStorage.getItem(process.env["NEXT_PUBLIC_ACCESS_TOKEN_KEY"]||"") ;
  const res = await Axios.put(`/toggle/block/${user_id}`,{headers: { Authorization: `Bearer ${t}` } })
  return res.data;

}