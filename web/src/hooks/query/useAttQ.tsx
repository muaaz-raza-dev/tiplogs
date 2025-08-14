"use client";
import { GetAttendanceModuleGroupPairsApi, GetAttendanceModuleSpecificGroupsApi, GetAttendanceModulesUserSpecific, GetAttendanceWeeklyOverviewApi, IweeklyAttendanceRequestPayload } from "@/app/api/att.api";
import { useMutation, useQuery } from "@tanstack/react-query";
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
return useMutation({
    mutationFn:(payload:IweeklyAttendanceRequestPayload)=>GetAttendanceWeeklyOverviewApi(payload),
    onSuccess(){

    },
    onError(error :any) {
        toast.error(error.response.data.message)
    },
})    
}
