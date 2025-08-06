import { CreateAttModuleformApi } from "@/app/api/att_module.api";
import { ICreateAttModuleform } from "@/types/att_module";
import { useMutation } from "@tanstack/react-query";
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