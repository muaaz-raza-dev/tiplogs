"use client"

import { authenticateApi,  loginApi,  registerAdminApi, RequestEmailVerificationApi } from "@/app/api/auth.api";
import { AuthSession, userAccessTokenAtom, UserVerificationAttempts } from "@/lib/atoms/auth-session.atom";
import { ILoginForm, ISignupAdminForm } from "@/types/auth.t";
import { useMutation, useQuery  } from "@tanstack/react-query" 
import toast from "react-hot-toast";
import { useSetAtom,useAtomValue} from "jotai";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Cookie from "js-cookie";
import { AxiosError } from "axios";
import { UserRole } from "@/types/users";
export function useSignUpAdminQ({ reset }: { reset?: () => void; } = {}) {
    const setState = useSetAtom(AuthSession);
    const setAccessToken = useSetAtom(userAccessTokenAtom)
    const router = useRouter();
    return useMutation({ 
        mutationFn: (data:ISignupAdminForm)=> registerAdminApi(data),
        onSuccess: (data) => {
            toast.success("Registration successful !");
            reset?.();
            setAccessToken(data.payload.accessToken)

            setState({
                isLoggedIn: true,
                user: data.payload.user,
            });

            router.push("/auth/request/verify");

        },
        
    });

}


export function useLogin({ reset }: { reset?: () => void; } = {}) {
    const setState = useSetAtom(AuthSession);
    const setAccessToken = useSetAtom(userAccessTokenAtom)
    const router = useRouter();
    return useMutation({ 
        mutationFn: (data:ILoginForm)=> loginApi(data),
        onSuccess: (data) => {
            toast.success("Registration successful !");
            reset?.();
            setAccessToken(data.payload.accessToken)
            setState({
                isLoggedIn: true,
                user: data.payload.user,
            });
            if (data?.payload?.user.role == UserRole.ADMIN && !data?.payload?.user.is_verified){
              router.push("/auth/request/verify");
            }

        },
        
    });

}


export default function useAuthenticate() {
    const setState = useSetAtom(AuthSession);
    const router = useRouter();
    const setAccessToken = useSetAtom(userAccessTokenAtom)
    const query = useQuery({
        queryKey: ["auth-session"],
        queryFn: authenticateApi,
        refetchOnWindowFocus: false,
        retry:2,
        staleTime: 1000 * 60 * 5, 
})
  useEffect(() => {
    if (query.status === "success" && query.data) {
      setAccessToken(query.data.payload.accessToken)
      setState({
        isLoggedIn: true,
        user: query.data.payload.user,
      });
    }
    if (query.isError ) {
        const error = query.error as AxiosError;
        if (error?.response?.status === 401 || error?.response?.status === 403) { 
        setAccessToken("")
          setState({
            isLoggedIn: false,
          });    
          toast.error("Authentication failed. Please log in again.");
          Cookie.remove(process.env.NEXT_PUBLIC_REFRESH_TOKEN_COOKIE_KEY||"tl_refresh_token");
          router.push("/auth/login");
        }
    }
  }, [query.status, query.data, setState]);

  return query;

}


export function useRequestVerification() {
  const state = useAtomValue(AuthSession);
  const setVerificationAttempts = useSetAtom(UserVerificationAttempts);
  return useMutation({
    mutationFn:(email:string)=>RequestEmailVerificationApi({email}),
    onSuccess: (data) => {
      toast.success("Verification email sent successfully!");
      setVerificationAttempts(+data?.payload?.verification_attempts);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to send verification email.");
    },

    
  })
}