"use client"

import { registerAdminApi } from "@/app/api/auth/register.api";
import { ISignupAdminForm } from "@/types/auth.t";
import { useMutation } from "@tanstack/react-query" 

export function useSignUpAdminQ() {
    return useMutation({ 
        mutationFn: (data:ISignupAdminForm)=> registerAdminApi(data),
        onSuccess: (data) => {
            console.log("Admin registered successfully", data);
        },
        
    });

}