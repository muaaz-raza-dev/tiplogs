"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shadcn/components/ui/card"
import { Button } from "@/shadcn/components/ui/button"
import { CheckCircle, Mail } from "lucide-react"
import { useAtomValue } from "jotai"
import { AuthSession, UserVerificationAttempts } from "@/lib/atoms/auth-session.atom"
import { Label } from "@/shadcn/components/ui/label"
import { Input } from "@/shadcn/components/ui/input"
import {  useEffect, useState } from "react"
import { useRequestVerification } from "@/hooks/query/auth/useAuthQ"
import toast from "react-hot-toast"
import clsx from "clsx"
import ServerRequestLoader from "@/components/loaders/server-request-loader"


 function RequestEmailVerification() {
    const attempt = Number(useAtomValue(UserVerificationAttempts));
    const limit = Number(process.env["NEXT_PUBLIC_VERIFICATION_ATTEMPTS_LIMIT"])
    const {mutate,isPending} = useRequestVerification()
    const {user} = useAtomValue(AuthSession)
    const [email,setEmail] = useState(user?.email||"");

    useEffect(() => {
        setEmail(user?.email || "");    
    }, [user?.email]);

    function Request() {
        if (!email) {
            toast.error("Please enter your email address.");
            return;
        }
        mutate(email);
    }
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
          <CheckCircle className="h-6 w-6 text-secondary-foreground" />
        </div>
        <CardTitle className="text-2xl font-bold ">Verify your email </CardTitle>
        <CardDescription>

          We are about to sent a verification link to your <strong>{email}</strong>

        <div className="mt-2">
            <Label>
                Email 
            </Label>
            <Input 
                value={email }
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2"
            />
        </div>
        </CardDescription>
      </CardHeader>

      <CardContent >
        

       
        <Button  onClick={Request} disabled={isPending|| attempt >= limit }  className={clsx("w-full",attempt >= limit && "grayscale-100 !cursor-not-allowed")} >
          {
            isPending ? 
            <ServerRequestLoader/>
             : 
            <>
            <Mail className="ml-2 h-4 w-4" />
            <span>
                {
                  !attempt ?
                  "Proceed to verify":
                    +attempt < limit  ? `Resend (${ limit - attempt } left)` : 
                    "Contact support"
                }
            </span>
                  </>
                }
        </Button>
        
         {
          attempt >= limit ?
          <p className="text-xs text-center  text-destructive my-2 ">
            "You have reached the limit of attempt verification attempts. ": 
          </p> 
      : null 
        }

        {
          attempt ?
<div className=" border-t py-2 text-sm text-muted-foreground text-center mt-2">
          <p>Check your email and click the verification link to activate your account.</p>
        </div>
         :null
}

      </CardContent>
    </Card>
  )
}

export default RequestEmailVerification