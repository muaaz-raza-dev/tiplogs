import { IRegisterUserForm } from "@/types/users";
import { Axios } from "./axios";
import { IgeneralAuthResponse } from "@/types/auth.t";

export async function registerUserbyAdminApi(data: IRegisterUserForm,t:string) {
  const res = await Axios.post<IgeneralAuthResponse>("/user/register/manual", data, 
    {
      headers:{Authorization: `Bearer ${t}`}
    }
  ); 
  return res.data
}

export async function getAllUsersApi(count:number, t: string) {
  const res = await Axios.get(`/user/users?count=${count}`, 
    {
      headers: { Authorization: `Bearer ${t}` } 
    })
  return res.data;

}