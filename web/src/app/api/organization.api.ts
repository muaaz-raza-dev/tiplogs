import { Organization } from "@/types/organization.t";
import { Axios } from "./axios";




export async function registerOrganizationApi( name: string ,t : string ) {
    
    const res = await Axios.post<{ payload:{organization:Organization,accessToken:string} }>("/org/register", {name: name},
        {
        headers: {
            Authorization: `Bearer ${t}`,
        }
        }
    
    );
    return res.data;
}

