import {Axios} from "../axios";
import {ISignupAdminForm} from "@/types/auth.t";

export async function registerAdminApi(data: ISignupAdminForm) {
  const res = await Axios.post("/auth/register/admin", data) 
  return res.data
}


export async function registerUserApi(data: ISignupAdminForm) {
  const res = await Axios.post("/auth/register/admin", data) 
  return res.data
}