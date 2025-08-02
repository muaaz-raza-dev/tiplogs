"use client"
import {  CreateNewIndividualsApi,  EditNewIndividualApi,  GetDetailedIndividualApi,  GetEditStudentDetails,  GetIndividualsApi, GetMetaRegistrationPayload, IGetIndividualfilters } from "@/app/api/individual.api";
import { individualListingAtom } from "@/lib/atoms/indiviudals.atom";
import { IRegisterIndividualForm } from "@/types/individual.t";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";


export function useGetMetaRegistrationPayload(){
    return useQuery({queryKey:["individual","registration"],queryFn:GetMetaRegistrationPayload})
}

export function useCreateNewIndividual(reset?:()=>void){
    return useMutation({
        mutationFn:(payload:IRegisterIndividualForm)=>CreateNewIndividualsApi(payload),
        onSuccess(data) {
            toast.success(data?.payload?.message||"Individual is created successfully ")
            reset?.()
        },
        onError(){
            toast.error("Registration has failed . Try again later")
        }
    })
}


export function useEditIndividualData(){
    const params = useParams()
    const router = useRouter()
    const id =( params.id || "") as string
    return useMutation({
        mutationFn:(payload:IRegisterIndividualForm)=>EditNewIndividualApi(id,payload),
        onSuccess(data) {
            toast.success(data?.payload?.message||"Editted successfully ")
            router.push(`/dashboard/individuals/${id}`)
        },
        onError(){
            toast.error("Failed to edit the details . Try again later")
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

export function useGetIndividualDetailed(){
    const params = useParams()
    const id =( params.id || "") as string
    return useQuery({queryKey:["individual",id], 
        queryFn:()=>GetDetailedIndividualApi(id)
        ,enabled:!!id,retry:2,refetchOnMount:false,refetchOnWindowFocus:false} 
    )

}

export function useGetEditIndividualData(enabled?:boolean){
    const params = useParams()
    const id =( params.id || "") as string
    return useQuery({queryKey:["individual","edit",id], 
        queryFn:()=>GetEditStudentDetails(id)
        ,enabled:!!id || enabled ,retry:2,refetchOnMount:false,refetchOnWindowFocus:false
    } 
    )
}