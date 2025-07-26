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

