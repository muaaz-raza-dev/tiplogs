"use client";
import { GetAttendanceModuleGroupPairsApi, GetAttendanceModuleSpecificGroupsApi, GetAttendanceModulesUserSpecific, GetAttendanceWeeklyOverviewApi, IweeklyAttendanceRequestPayload } from "@/app/api/att.api";
import { AttOverviewDailyDocsAtom } from "@/lib/atoms/att-details-group-module.atom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

export function useGetAttModulesUserSpecific(){
    return useQuery({queryFn:GetAttendanceModulesUserSpecific,queryKey:["user","modules","specific"],staleTime:3600*10,refetchOnMount:false,retry:2,refetchOnWindowFocus:false})
}

export function useGetAttGroupsSpecificModule(){
    const searchParams = useSearchParams()
    const module = (searchParams.get("module") || "")as string
    return useQuery({queryFn:()=>GetAttendanceModuleSpecificGroupsApi(module),enabled:!!module,queryKey:["user","group","specific"],staleTime:3600*10,refetchOnMount:false,retry:2,refetchOnWindowFocus:false})
}


export function useGetModuleGroupPairs(){
    return useQuery({queryFn:GetAttendanceModuleGroupPairsApi,queryKey:["user","group","module","pairs"],staleTime:3600*10,refetchOnMount:false,retry:2,refetchOnWindowFocus:false})
}

export function useAttendanceWeeklyOverview(){
    const setState = useSetAtom(AttOverviewDailyDocsAtom)
return useMutation({
    mutationFn:(payload:IweeklyAttendanceRequestPayload)=>GetAttendanceWeeklyOverviewApi(payload),
    onSuccess({payload}){
        setState(payload)
    },
    onError(error :any) {
        toast.error(error.response.data.message)
    },
})    
}
