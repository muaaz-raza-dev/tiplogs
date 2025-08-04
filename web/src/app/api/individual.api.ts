import { IapproveSelfRegistrationRequestForm, IindividualDetailedResponse, IIselfRegisterSchemaRequestPayload, IRegisterIndividualForm, IselfRegistrationRequestsIndividuals } from "@/types/individual.t";
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
  const res = await Axios.put(`/individuals/edit/${id}`,payload,{headers:{Authorization: `Bearer ${token}`}});
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


export async function RegisterSelfIndividualRequest(token:string,payload:IIselfRegisterSchemaRequestPayload){
    const res = await Axios.post(`/individuals/register/self/${token}`,payload);
    return res.data;
}


export interface FetchSelfRegistrationRequestsRequestPayload{
  q:string ;
  count :number ;
  status : "pending" | "all" | "rejected" ; 
}
export async function FetchRegisterSelfIndividualRequests(payload:FetchSelfRegistrationRequestsRequestPayload){
  const token = sessionStorage.getItem(process.env["NEXT_PUBLIC_ACCESS_TOKEN_KEY"]||"") ;
    const res = await Axios.post(`/individuals/self/registration/requests`,payload,{headers:{Authorization: `Bearer ${token}`}});
    return res.data;
}

interface IselfRegistrationRequestsDetailedResponse{
  details: {
    full_name: string;
    father_name: string;
    cnic: string;
    dob: string; // ISO string date
    email: string;
    gender: "male" | "female" | "other";
    contact:string;
    is_rejected: boolean;
    is_approved: boolean;
  };
  simillars: Array<{
    full_name: string;
    father_name: string;
    cnic: string;
    phone: string;
    grno: string;
    created_at: string; // ISO string date
    id: string;
    group: {
      name: string;
      id: string;
    };
  }>;
}
export async function GetSelfRegistrationRequestDetailed(id:string){
  const token = sessionStorage.getItem(process.env["NEXT_PUBLIC_ACCESS_TOKEN_KEY"]||"") ;
  const res = await Axios.get<{payload:IselfRegistrationRequestsDetailedResponse}>(`/individuals/self/registration/detail/${id}`,{headers:{Authorization: `Bearer ${token}`}});
  return res.data;

}



export async function ApproveSelfRegistrationRequestApi(payload:IapproveSelfRegistrationRequestForm,id:string){
  const token = sessionStorage.getItem(process.env["NEXT_PUBLIC_ACCESS_TOKEN_KEY"]||"") ;
  const res = await Axios.put(`/individuals/approve/registration/self/${id}`,payload,{headers:{Authorization: `Bearer ${token}`}});
  return res.data;
}


export async function RejectSelfRegistrationRequestApi(dlt:boolean,id:string){
  const token = sessionStorage.getItem(process.env["NEXT_PUBLIC_ACCESS_TOKEN_KEY"]||"") ;
  const res = await Axios.put(`/individuals/reject/registration/self/${id}/?delete=${dlt}`,{},{headers:{Authorization: `Bearer ${token}`}});
  return res.data;
}