import { GetIndividualAutoRegistrationStatusApi, registerOrganizationApi, ToggleIndividualAutoRegistrationStatusApi } from "@/app/api/organization.api";
import { AuthSession, userAccessTokenAtom } from "@/lib/atoms/auth-session.atom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAtom, useSetAtom } from "jotai";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { AxiosError } from "axios";


export function useRegisterOrganization() {
    const [state,setState] = useAtom(AuthSession);
    const setAccessToken = useSetAtom(userAccessTokenAtom)
    const router = useRouter();
    return useMutation({ 
        mutationFn: (name:string)=> registerOrganizationApi(name),
        onSuccess: (data) => {
            setAccessToken(data.payload.accessToken)
            toast.success("Welcome to tiplogs !");
            setState({...state, ...(state.user ? {user: {...state.user, organization: data.payload.organization.id}}:{})});
            router.push("/dashboard");
        },
        onError(error:AxiosError<{message: string}>) {
            toast.error(error?.response?.data.message || "Failed to register organization");
        },
    });

}

export function useGetIndividualAutoRegistrationStatus()
{
    return useQuery({
        queryKey:["organization ","ind","registration ","status"] ,
        queryFn:GetIndividualAutoRegistrationStatusApi,
        staleTime:3600*10,
        refetchOnMount:false,
        refetchOnWindowFocus:false
    })
}



export function useFetchIndividualAutoRegistrationStatus(refetch:()=>void) {
    return useMutation({ 
        mutationFn: (status:boolean)=> ToggleIndividualAutoRegistrationStatusApi(status),
        onSuccess: (data) => {
            toast.success(data.payload.status ? "Registration requests is turned on "  : "Registration requests is turned off")
            refetch()
        },
        onError(error:AxiosError<{message: string}>) {
            toast.error(error?.response?.data.message || "Failed to toggle registration requests");
        },
    });

}