import { IindividualDetailedResponse, IRegisterIndividualForm } from "@/types/individual.t";
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


export async function CreateNewIndividualsApi(payload:IRegisterIndividualForm){
  const token = sessionStorage.getItem(process.env["NEXT_PUBLIC_ACCESS_TOKEN_KEY"]||"") ;
  const res = await Axios.post(`/individuals/register/manual`,payload,{headers:{Authorization: `Bearer ${token}`}});
  return res.data
}

export async function EditNewIndividualApi(id:string,payload:IRegisterIndividualForm){
  const token = sessionStorage.getItem(process.env["NEXT_PUBLIC_ACCESS_TOKEN_KEY"]||"") ;
  const res = await Axios.post(`/individuals/edit/${id}`,payload,{headers:{Authorization: `Bearer ${token}`}});
  return res.data
}
export interface IGetIndividualfilters {
  q:string ;
  count:number ;
  group:string ;
}

export async function GetIndividualsApi(payload:IGetIndividualfilters){
  const token = sessionStorage.getItem(process.env["NEXT_PUBLIC_ACCESS_TOKEN_KEY"]||"") ;
  const res = await Axios.post(`/individuals/get`,payload,{headers:{Authorization: `Bearer ${token}`}});
  return res.data
}


export async function GetDetailedIndividualApi(id:string){
  const token = sessionStorage.getItem(process.env["NEXT_PUBLIC_ACCESS_TOKEN_KEY"]||"") ;
  const res = await Axios.get<{payload:IindividualDetailedResponse}>(`/individuals/get/${id}`,{headers:{Authorization: `Bearer ${token}`}});
  return res.data
}


export async function GetEditStudentDetails(id:string){
  const token = sessionStorage.getItem(process.env["NEXT_PUBLIC_ACCESS_TOKEN_KEY"]||"") ;
  const res = await Axios.get<{payload:IRegisterIndividualForm}>(`/individuals/get/edit/${id}`,{headers:{Authorization: `Bearer ${token}`}});
  return res.data
}
