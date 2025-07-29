import { GetMetaRegistrationPayload } from "@/app/api/individual.api";
import { useQuery } from "@tanstack/react-query";


export function useGetMetaRegistrationPayload(){
    return useQuery({queryKey:["individual","registration"],queryFn:GetMetaRegistrationPayload})
}