import { CreateAttModuleformApi, GetAttModulesApi } from "@/app/api/att_module.api";
import { ICreateAttModuleform } from "@/types/att_module";
import { useMutation, useQuery } from "@tanstack/react-query";
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