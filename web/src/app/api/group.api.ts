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

export async function FetchGroupActicationHistory(id:string){
    const t = sessionStorage.getItem(process.env["NEXT_PUBLIC_ACCESS_TOKEN_KEY"]||"") ;
    const res = await Axios.post(`/groups/history/${id}`,{},{ headers: { Authorization: `Bearer ${t}`,}} );
    return res.data

}
export async function GetGroupIdPairs (){
    const t = sessionStorage.getItem(process.env["NEXT_PUBLIC_ACCESS_TOKEN_KEY"]||"") ;
    const res = await Axios.get<{payload:{id:string,name:string}[],message:string}>(`/groups/pair`,{ headers: { Authorization: `Bearer ${t}`,}} );
    return res.data
}

interface IgroupIndividual{
    group:{name:string,created_at:string}
    individuals:{full_name:string,father_name:string,roll_no:string,grno:string,id:string}[]
}
export async function GetGroupIndividualListsApi(id:string){
    const t = sessionStorage.getItem(process.env["NEXT_PUBLIC_ACCESS_TOKEN_KEY"]||"") ;
    const res = await Axios.get<{payload:IgroupIndividual}>(`/groups/individuals/${id}`,{ headers: { Authorization: `Bearer ${t}`,}} );
    return res.data
}