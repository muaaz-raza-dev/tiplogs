import { GetMetaAttendanceInfo, MarkAttendanceApi, ValidateDateAndIdApi } from "@/app/api/mark_att.api";
import { MarkAttendanceAtom, MarkAttendanceListAtom } from "@/lib/atoms/mark-att.atom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useParams } from "next/navigation";
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
    setAttendances(query.data.payload.individuals.map(e=>({individual:e,status:"",reporting_time:""})))
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
        setTimeout(() => {setState({...state,general:{...state.general,attendance_group_id:payload.attendance_group,att_date:new Date(payload.date)}})}, 100);
      },
      onError(err :any){
          toast.error(err.response.data.message)
      }
  }

  )
}







export function useMarkAttendance() {
  const attendance = useAtomValue(MarkAttendanceListAtom)  
  const {general} = useAtomValue(MarkAttendanceAtom)  

  return useMutation(
    {
      mutationFn:()=>MarkAttendanceApi(general.attendance_group_id,
        attendance.map(e=>({...e,individual:e.individual.id}))
      ),
      onSuccess({payload}){

      },
      onError(err :any){
          toast.error(err.response.data.message)
      }
  }

  )
}