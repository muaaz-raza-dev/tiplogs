"use client"
import { getAllUsersApi, IGetAllUsersPayload, registerUserbyAdminApi, ToggleBlockUserApi } from "@/app/api/user.api";
import {  userAccessTokenAtom } from "@/lib/atoms/auth-session.atom";
import { UsersListingAtom } from "@/lib/atoms/users.atom";
import { IRegisterUserForm } from "@/types/users";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useAtom, useAtomValue } from "jotai";
import toast from "react-hot-toast";


export function useRegisterUserByAdmin( reset?: () => void ) {
    const accessToken = useAtomValue(userAccessTokenAtom);
    return useMutation({ 
        mutationFn: (data:IRegisterUserForm)=> registerUserbyAdminApi(data),
        onSuccess: (data) => {
            toast.success(data.message || "User registered successfully!");
            reset?.();
        },
        
    });

}

export function useFetchAllUsers() {
    const [state,setState] = useAtom(UsersListingAtom);
    
    const query = useMutation({
        mutationKey:["users",state.count],
        mutationFn: (payload:IGetAllUsersPayload) => getAllUsersApi(payload ),
        onSuccess(data) {
            setState(s=>({
                ...s,
                users: {...s.users,[state.count]:data.payload.users},
                total : data.payload.total
            }));
        },
        onError(error){
            if (error instanceof AxiosError){
                toast.error(error.response?.data.message || "Failed to fetch users");   
            }
        }

    });

 
    return query
}




export function useToggleUserBLockQ() {
    const [state,setState] = useAtom(UsersListingAtom);
    const query = useMutation({
        mutationKey:["users","block"],
        mutationFn: (userid:string) => ToggleBlockUserApi(userid),
        onSuccess(data) {
            setState(s=>({
                ...s,
                users: {...s.users,[state.count]:[

                
                    ...s.users[state.count].filter(e=>e.id!=data.payload.user.id),data.payload.user ]

                }, 
                total : data.payload.total
            }));
        },
        onError(error){
            if (error instanceof AxiosError){
                toast.error(error.response?.data.message || "Failed to fetch users");   
            }
        }

    });

 
    return query
}