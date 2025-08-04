"use client";
import useAuthenticate from "@/hooks/query/useAuthQ"
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import AppLoader from "./loaders/app-loader";
function AuthenticateMiddleware({children}: {children: React.ReactNode}) {
    const router = useRouter();
    const pathname = usePathname()
    const {data,isPending,} = useAuthenticate();

  useEffect(() => {
    if (!isPending ) {
      
      if( data?.payload?.user?.role == "admin") {
        if(!data?.payload?.user?.is_verified) {
          
          router.push("/auth/verify");
        }
        if (!data.payload.user.organization){
          router.push("/organization/new");
        }
        else {
          if (pathname === "/organization/new") {
          router.push("/dashboard");
        }
      }
    }
    
  }}, [isPending]);


 if (isPending){
  return <AppLoader/>
 }


  return  children 
}

export default AuthenticateMiddleware