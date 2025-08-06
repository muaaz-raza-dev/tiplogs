import { ICreateAttModuleform } from "@/types/att_module";
import { Axios } from "./axios";

export async function CreateAttModuleformApi(data:ICreateAttModuleform) {
  const t = sessionStorage.getItem(process.env["NEXT_PUBLIC_ACCESS_TOKEN_KEY"]||"") ;
  const res = await Axios.post("/att/module/create", data, {
      headers: { Authorization: `Bearer ${t}` } 
    }) 
  return res.data
}
