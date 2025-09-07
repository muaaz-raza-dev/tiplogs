"use client";
import { DeleteAttendanceRecordApi, DeleteScheduleCustomAttendanceApi, FetchEachAttendanceDetailedViewApi, GetAttendanceModuleGroupPairsApi, GetAttendanceModuleSpecificGroupsApi, GetAttendanceModulesUserSpecific, GetAttendanceWeeklyOverviewApi, GetScheduledCustomAttendance, IweeklyAttendanceRequestPayload, ScheduleCustomAttendanceApi } from "@/app/api/att.api";
import { AttOverviewDailyDocsAtom, AttOverviewDailyFiltersAtom } from "@/lib/atoms/att-details-group-module.atom";
import { AttViewEachFilterAtom, AttViewEachListAtom } from "@/lib/atoms/att-view-each.atom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

export function useGetAttModulesUserSpecific(disabled?:boolean){
    return useQuery({queryFn:GetAttendanceModulesUserSpecific,queryKey:["user","modules","specific"],staleTime:3600*10,refetchOnMount:false,retry:2,refetchOnWindowFocus:false,enabled:!disabled})
}

export function useGetAttGroupsSpecificModule(){
    const {data} = useGetAttModulesUserSpecific(true)
    const searchParams = useSearchParams()
    const module = (searchParams.get("module") || (data?.payload.modules[0]?.id ?? "") )as string
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


export function useScheduledCustomAttendanceBase(){
    const params = useSearchParams()
    const module = params.get("module")
    return useQuery({queryKey:[module,"scheduled","attendances"],queryFn:()=>GetScheduledCustomAttendance(module??""),enabled:!!module,staleTime:3600*10,refetchOnMount:false,retry:2,refetchOnWindowFocus:false})
}


export function useScheduleAttendance(){
    const params = useSearchParams()
    const module = params.get("module")
    const{refetch} = useScheduledCustomAttendanceBase()
return useMutation({
    mutationFn:(payload:{att_date:string,att_base?:string})=>ScheduleCustomAttendanceApi(module||"",payload.att_date,payload.att_base),
    onSuccess(){
        toast.success("Attendance is scheduled successfully")
        refetch()
    },
    onError(error :any) {
        toast.error(error.response.data.message)
    },
})    
}

export function useDeleteScheduleAttendance(){
    const{refetch} = useScheduledCustomAttendanceBase()
return useMutation({
    mutationFn:(att_base:string)=>DeleteScheduleCustomAttendanceApi(att_base||""),
    onSuccess({message}){
        toast.success(message)
        refetch()
    },
    onError(error :any) {
        toast.error(error.response.data.message)
    },
})    
}


export function useFetchEachAttendanceDetailedView(init_payload?:{module:string,group:string,att_date:string}){
    const setState = useSetAtom(AttViewEachListAtom)
    const [filters,setFilters] = useAtom(AttViewEachFilterAtom)
    return useMutation({
        mutationFn:({module,group,att_date}:{module:string,group:string,att_date:string})=>FetchEachAttendanceDetailedViewApi({module,group,att_date}),
        onSuccess({payload}){
            setState(payload)
        },
        onError(error :any) {
            toast.error(error.response.data.message)
        },
        onSettled(){
            if (init_payload){
                const {module,group,att_date} = init_payload||{module:"",group:"",att_date:""}
                setFilters({att_date,group,module,status_selected:"",is_fetched:true})
            }
            else {
                setFilters({...filters,is_fetched:true})
            }
        }
    })
} 

export function useDeleteAttendanceRecord(){
    
    const state = useAtomValue(AttOverviewDailyFiltersAtom)    
    return useMutation({
        mutationFn:(att_base:string)=>DeleteAttendanceRecordApi(att_base),
        onSuccess({message}){
            
            toast.success(message)
        },
        onError(error :any) {
            toast.error(error.response.data.message)
        },
    })
}