import { CreateNewIndividuals,  GetIndividualsApi, GetMetaRegistrationPayload, IGetIndividualfilters } from "@/app/api/individual.api";
import { individualListingAtom } from "@/lib/atoms/indiviudals.atom";
import { IRegisterIndividualForm } from "@/types/individual.t";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";
import toast from "react-hot-toast";


export function useGetMetaRegistrationPayload(){
    return useQuery({queryKey:["individual","registration"],queryFn:GetMetaRegistrationPayload})
}

export function useCreateNewIndividual(reset?:()=>void){
    return useMutation({
        mutationFn:(payload:IRegisterIndividualForm)=>CreateNewIndividuals(payload),
        onSuccess(data) {
            toast.success(data?.payload?.message||"Individual is created successfully ")
            reset?.()
        },
        onError(){
            toast.error("Registration has failed . Try again later")
        }
    })
}

export function useGetIndividuals(){
    const [state,setState] = useAtom(individualListingAtom)

        return useMutation({
        mutationFn:(payload:IGetIndividualfilters)=>GetIndividualsApi(payload),
        onSuccess({payload}) {
            setState({...state,total:payload.total,count:payload.count,results:{...state.results,[payload.count]:payload.results}})
        },
        onError(err){
            toast.error("Failed to fetch individuals")
        }

    })
}