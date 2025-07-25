import {IgeneralAuthResponse, ILoginForm, ISignupAdminForm} from "@/types/auth.t";
import { Axios } from "./axios";

export async function registerAdminApi(data: ISignupAdminForm) {
  const res = await Axios.post("/auth/register/admin", data) 
  return res.data
}

export async function loginApi(data: ILoginForm) {
  const res = await Axios.post<IgeneralAuthResponse>("/auth/login", data) 
  return res.data
}


export async function registerUserApi(data: ISignupAdminForm) {
  const res = await Axios.post("/auth/register/admin", data) 
  return res.data
}



export async function authenticateApi() {
  const res = await Axios.get<IgeneralAuthResponse>("/auth/session")
  return res.data
}

export async function RequestEmailVerificationApi(token: string,payload: {email: string}) {
  const res = await Axios.post(`/auth/request/verification`,payload,{headers:{Authorization: `Bearer ${token}`}});
  return res.data;
}