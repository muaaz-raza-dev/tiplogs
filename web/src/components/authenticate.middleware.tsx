"use client";
import useAuthenticate from "@/hooks/query/auth/useAuthQ"
import { useRouter } from "next/navigation";
import { useEffect } from "react";
function AuthenticateMiddleware({children}: {children: React.ReactNode}) {
    const router = useRouter();
    const {data,isPending} = useAuthenticate();

  useEffect(() => {
    // if (!isPending && data?.payload?.user?.role === "admin" && !data?.payload?.user?.is_verified) {
      // router.push("/auth/verify");
    // }
  }, [isPending, data, router]);

 


  return ( <>  {children} </> )
}

export default AuthenticateMiddleware