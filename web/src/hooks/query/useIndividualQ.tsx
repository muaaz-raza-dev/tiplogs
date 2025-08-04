"use client"
import {  CreateNewIndividualsApi,  EditNewIndividualApi,  FetchRegisterSelfIndividualRequests,  FetchSelfRegistrationRequestsRequestPayload,  GetDetailedIndividualApi,  GetEditStudentDetails,  GetIndividualsApi, GetMetaRegistrationPayload, GetSelfRegistrationRequestDetailed, IGetIndividualfilters, RegisterSelfIndividualRequest } from "@/app/api/individual.api";
import { individualListingAtom, invidualRegistrationRequestsListingAtom } from "@/lib/atoms/indiviudals.atom";
import { IIselfRegisterSchemaRequestPayload, IRegisterIndividualForm, IselfRegisterSchema } from "@/types/individual.t";
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
            toast.success(data?.message||"Individual is created successfully ")
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
            toast.success(data?.message||"Editted successfully ")
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


export function useRegisterSelfIndividualRequest(reset:()=>void){
    const params = useParams()
    const token =( params.token || "") as string
    return useMutation({mutationFn:(payload:IIselfRegisterSchemaRequestPayload)=>RegisterSelfIndividualRequest(token,payload)
        , onSuccess(data) {
            reset()
            toast.success(data.message)
        },
        onError(error){
            console.log(error)
            toast.error("Something went wrong. Try again later")
        }
    })
}









export function useFetchSelfRegistrationRequests(){
    const [state,setState] = useAtom(invidualRegistrationRequestsListingAtom)
    return useMutation({mutationFn:(payload:FetchSelfRegistrationRequestsRequestPayload)=>FetchRegisterSelfIndividualRequests(payload)
        , onSuccess(data) {
            setState({...state,results:{...state.results,[data.payload.count]:data.payload.requests,},total:data.payload.total,count:data.payload.count})
        },
        onError(error){
            console.log(error)
            toast.error("Requests could not be fetched . Try again later")
        }
    })
}




export function useGetSelfRegistrationRequestDetails(enabled?:boolean){
    const params = useParams()
    const id =( params.id || "") as string
    return useQuery({queryKey:["self","registration","request",id], 
        queryFn:()=>GetSelfRegistrationRequestDetailed(id)
        ,enabled:!!id || enabled ,retry:2,refetchOnMount:false,refetchOnWindowFocus:false
    } 
    )
}
