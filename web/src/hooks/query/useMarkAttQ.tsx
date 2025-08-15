import { GetMetaAttendanceInfo, MarkAttendanceApi, ValidateDateAndIdApi } from "@/app/api/mark_att.api";
import { MarkAttendanceAtom, MarkAttendanceListAtom } from "@/lib/atoms/mark-att.atom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";

export function useGetMarkAttMetaData() {
  const [state,setState]= useAtom(MarkAttendanceAtom)  
  const setAttendances= useSetAtom(MarkAttendanceListAtom)  
  const params = useParams();
  const { group, module } = params as { group: string; module: string };

  const query = useQuery({
    queryKey: ["mark", "att", module, group],
    queryFn: () => GetMetaAttendanceInfo(module, group),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: 2,
    staleTime: 3600 * 2,
  });
  useEffect(() => {
  if(query.isSuccess){
    setState({...state,module:query.data.payload.module,group:query.data.payload.group,general:{...state.general,total_individuals:query.data.payload.total_individuals,unmarked:query.data.payload.total_individuals}})
    const reporting_time =(new Date().toLocaleTimeString()).split(":").slice(0,2).join(":")
    setAttendances(query.data.payload.individuals.map(e=>({individual:e,status:"",reporting_time:reporting_time,att_note:""})))
  }
  }, [query.data,query.isSuccess])
  return query
}


export function useFetchMarkAttDateAndDocId() {
  const [state,setState]= useAtom(MarkAttendanceAtom)  
  const params = useParams();
  const { group, module } = params as { group: string; module: string };
  return useMutation(
    {
      mutationFn:(date:string)=>ValidateDateAndIdApi(module,group,{date}),
      onSuccess({payload}){
        setTimeout(() => {setState({...state,general:{...state.general,attendance_group_id:payload.attendance_group,att_date:new Date(payload.date),status:payload.status}})}, 100);
      },
      onError(err :any){
        const payload = err?.response?.data?.payload
        if(payload){
          setTimeout(() => {setState({...state,general:{...state.general,status:payload.status,is_holiday:payload?.is_holiday??false,attendance_group_id:payload.attendance_group}})}, 100);
        }
      }
  }

  )
}







export function useMarkAttendance() {
  const attendance = useAtomValue(MarkAttendanceListAtom)  
  const {general} = useAtomValue(MarkAttendanceAtom)  
  const router = useRouter()
  return useMutation(
    {
      mutationFn:()=>MarkAttendanceApi(general.attendance_group_id,
        attendance.map(e=>({...e,individual:e.individual.id}))
      ),
      onSuccess(){
        toast.success("Attendance is registered successfully")
        router.push("/dashboard/attendance")
      },
      onError(err :any){
          toast.error(err.response.data.message)
      }
  }

  )
}