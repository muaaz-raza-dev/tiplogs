"use client";
import useAuthenticate from "@/hooks/query/auth/useAuthQ"
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Cookie from "js-cookie";
import AppLoader from "./loaders/app-loader";
function AuthenticateMiddleware({children}: {children: React.ReactNode}) {
    const router = useRouter();
    const {data,isPending,} = useAuthenticate();

  useEffect(() => {
    if (!isPending ) {
      if( data?.payload?.user?.role == "admin" && !data?.payload?.user?.is_verified) {
        router.push("/auth/verify");
      }
    }
    
  }, [isPending, data, router]);


 if (isPending){
  return <AppLoader/>
 }


  return  children 
}

export default AuthenticateMiddleware