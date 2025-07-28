import { Axios } from "./axios";




export async function CreateGroupApi( name: string  ) {
    const t = sessionStorage.getItem(process.env["NEXT_PUBLIC_ACCESS_TOKEN_KEY"]||"") ;
    
    const res = await Axios.post("/groups/create", {name: name},{ headers: { Authorization: `Bearer ${t}`,}} 
    );
    return res.data;
}
export async function EditGroupApi( name: string,id:string  ) {
    const t = sessionStorage.getItem(process.env["NEXT_PUBLIC_ACCESS_TOKEN_KEY"]||"") ;
    
    const res = await Axios.put(`/groups/edit/${id}`, {name: name},{ headers: { Authorization: `Bearer ${t}`,}} 
    );
    return res.data;
}


export async function GetGroupsApi(count:number,input:string){
    const t = sessionStorage.getItem(process.env["NEXT_PUBLIC_ACCESS_TOKEN_KEY"]||"") ;
    const res = await Axios.post(`/groups/?count=${count}&q=${input}`,{},{ headers: { Authorization: `Bearer ${t}`,}} );
    return res.data;
}