import { Axios } from "./axios";


export interface ImetaRegistrationPayload{
  GRNO?:string;
  groups:{name:string,id:string}[]
}
export async function GetMetaRegistrationPayload(){
  const token = sessionStorage.getItem(process.env["NEXT_PUBLIC_ACCESS_TOKEN_KEY"]||"") ;
  const res = await Axios.get<{payload:ImetaRegistrationPayload}>(`/groups/meta/registration`,{headers:{Authorization: `Bearer ${token}`}});
    return res.data
}