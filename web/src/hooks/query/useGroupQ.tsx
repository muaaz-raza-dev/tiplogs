import { CreateGroupApi } from "@/app/api/group.api";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function useCreateGroup(cb?:()=>void){
    return useMutation({
        mutationFn:(name:string)=>CreateGroupApi(name),
        mutationKey:["create a new group"],
        onSuccess() {
            toast.success("Class has created successfully");
            cb?.();
        },
    })
}