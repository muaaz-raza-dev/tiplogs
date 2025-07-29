import { CreateNewIndividuals, GetMetaRegistrationPayload } from "@/app/api/individual.api";
import { IRegisterIndividualForm } from "@/types/individual.t";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";


export function useGetMetaRegistrationPayload(){
    return useQuery({queryKey:["individual","registration"],queryFn:GetMetaRegistrationPayload})
}

export function useCreateNewIndividual(reset?:()=>void){
    return useMutation({
        mutationKey:["new", "individual"],
        mutationFn:(payload:IRegisterIndividualForm)=>CreateNewIndividuals(payload),
        onSuccess(data) {
            toast.success(data.message||"Individual is created successfully ")
            reset?.()
        },
        onError(err){
            toast.error("Registration has failed . Try again later")
        }

    })
}