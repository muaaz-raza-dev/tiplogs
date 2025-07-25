import { registerOrganizationApi } from "@/app/api/organization.api";
import { AuthSession } from "@/lib/atoms/auth-session.atom";
import { useMutation } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { AxiosError } from "axios";


export function useRegisterOrganization() {
    const [state,setState] = useAtom(AuthSession);
    const router = useRouter();
    return useMutation({ 
        mutationFn: (name:string)=> registerOrganizationApi(name,state.accessToken || ""),
        onSuccess: (data) => {
            toast.success("Welcome to tiplogs !");
            setState({...state,accessToken:data.payload.accessToken, ...(state.user ? {user: {...state.user, organization: data.payload.organization.id}}:{})});
            router.push("/dashboard");
        },
        onError(error:AxiosError<{message: string}>) {
            toast.error(error?.response?.data.message || "Failed to register organization");
        },
    });

}
