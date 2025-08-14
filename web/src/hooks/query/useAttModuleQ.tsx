import { CreateAttModuleformApi, EditAttModuleDetailsApi, GetAttModulesApi, GetModuleGroupUsersApi,  IUpdateAssignedGroupUsersAttModulePayload, UpdateAssignedGroupUsersAttModuleApi } from "@/app/api/att_module.api";
import { ICreateAttModuleform } from "@/types/att_module.t";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";

export function useCreateAttModule(reset:()=>void){
    return useMutation({
        mutationFn:(data:ICreateAttModuleform)=>CreateAttModuleformApi(data),
        onSuccess(){
            toast.success("Attendance module is created successfully")
            reset()
        },
        onError(error:any) {
            toast.error(error.response.data.message||"Attendance module is not created")
        },
    })
}

export function useEditAttModuleDetails(cb:()=>void){
    return useMutation({
        mutationFn:(data:{name:string,description:string,id:string})=>EditAttModuleDetailsApi(data),
        onSuccess(){
            toast.success("Attendance module is updated successfully")
            cb()
        },
        onError(error:any) {
            toast.error(error.response.data.message||"Attendance module is not created")
        },
    })
}

export function useGetAttModule(){
    return useQuery({
        queryKey:["attendance modules","all"],
        queryFn:GetAttModulesApi,
        staleTime:3600*10,
        refetchOnMount:false,
        retry:2,
        refetchOnReconnect:true,
        refetchOnWindowFocus:false
    })
}






export function useGetAttModuleGroupUsers(){
    const params = useParams()
    const id = (params.id || "") as string
    return useQuery({
        queryKey:["attendance modules","all","group-users"],
        queryFn:()=>GetModuleGroupUsersApi(id),
        staleTime:3600*10,
        enabled:!!id,
        refetchOnMount:false,
        retry:2,
        refetchOnReconnect:true,
        refetchOnWindowFocus:false
    })
}


export function useUpdateGroupUserAttendanceModule(cb:()=>void){
    const {refetch} = useGetAttModuleGroupUsers()
    const params = useParams()
    const id = (params.id || "") as string
    return useMutation({
        mutationFn:(data:IUpdateAssignedGroupUsersAttModulePayload)=>UpdateAssignedGroupUsersAttModuleApi(id,data),
        onSuccess(){
            toast.success("Attendance module is updated successfully")
            cb?.();
            refetch()
        },
        onError(error:any) {
            toast.error(error.response.data.message||"Action could not be performed")
        },
    })
}