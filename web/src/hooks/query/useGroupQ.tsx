import { CreateGroupApi, EditGroupApi, FetchGroupActicationHistory, GetGroupIdPairs, GetGroupsApi } from "@/app/api/group.api";
import { GroupsListingAtom } from "@/lib/atoms/groups.atom";
import { useMutation, useQueries, useQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";
import toast from "react-hot-toast";

export function useCreateGroup(cb?:()=>void){
    const [state,setState] = useAtom(GroupsListingAtom)
    return useMutation({
        mutationFn:(name:string)=>CreateGroupApi(name),
        mutationKey:["create a new group"],
        onSuccess(data) {
            toast.success("Class has created successfully");
            setState({...state,groups:state.groups.concat(data.payload.group),total:state.total+1})
            cb?.();
        },
    })
}

export function useEditGroup(cb?:()=>void){
    const [state,setState] = useAtom(GroupsListingAtom)
    return useMutation({
        mutationFn:({name,id}:{name:string,id:string})=>EditGroupApi(name,id),
        mutationKey:["edit group name"],
        onSuccess(data) {
            setState({...state,groups:state.groups.map(e=>{
                if( e.id == data.payload.group.id ) {
                    return data.payload.group
                }
                return e

            }),total:state.total+1})
            toast.success("Class details has updated successfully");
            cb?.();
        },
    })
}

export function useGetGroups(){
    const [state,setState] = useAtom(GroupsListingAtom)
    return useMutation({
        mutationKey:["groups"],
        mutationFn:(payload:{count:number,input?:string})=>GetGroupsApi(payload.count,payload.input||state.filters.input||""),
        onSuccess(data) {
        setState({...state,groups:data.payload.groups,total:data.payload.total,count:data.payload.count})
        },
    })
}




export function useFetchGroupHistory(){
    return useMutation({
        mutationKey:["group","history"],
        mutationFn:(id:string)=>FetchGroupActicationHistory(id),
        
    })
}


export function useGetGroupPairs(){
    return useQuery({
        queryFn : GetGroupIdPairs ,
        queryKey : ["Groups Pairs","id"],
        refetchOnMount:false,
        refetchOnWindowFocus:false
    })

}