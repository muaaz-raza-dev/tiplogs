import { Organization } from "@/types/organization.t";
import { Axios } from "./axios";




export async function registerOrganizationApi( name: string  ) {
    const t = sessionStorage.getItem(process.env["NEXT_PUBLIC_ACCESS_TOKEN_KEY"]||"") ;
    
    const res = await Axios.post<{ payload:{organization:Organization,accessToken:string} }>("/org/register", {name: name},
        {
        headers: {
            Authorization: `Bearer ${t}`,
        }
        }
    
    );
    return res.data;
}


export async function GetIndividualAutoRegistrationStatusApi( ) {
    const t = sessionStorage.getItem(process.env["NEXT_PUBLIC_ACCESS_TOKEN_KEY"]||"") ;

    const res = await Axios.get<{ payload:{status:boolean,token:string} }>("/org/individual/registration/auto/status", 
        {  headers: {  Authorization: `Bearer ${t}`} }
    
    );
    return res.data;
}


export async function ToggleIndividualAutoRegistrationStatusApi(status:boolean  ) {
    const t = sessionStorage.getItem(process.env["NEXT_PUBLIC_ACCESS_TOKEN_KEY"]||"") ;

    const res = await Axios.put<{ payload:{status:boolean,token:string} }>("/org/individual/registration/auto/status", {status},
        {  headers: {  Authorization: `Bearer ${t}`} }
    );
    return res.data;
}



export async function VerifyIndivdiualSelfRegistrationApi(token:string  ) {
    const res = await Axios.get<{ payload:{organization:{name:string,id:string}} }>(`/org/verify/registration/auto/${token}`);
    return res.data;
}


