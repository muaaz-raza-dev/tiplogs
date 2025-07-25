"use client"
import { getAllUsersApi, registerUserbyAdminApi } from "@/app/api/user.api";
import { AuthSession } from "@/lib/atoms/auth-session.atom";
import { UsersListingAtom } from "@/lib/atoms/users.atom";
import { IRegisterUserForm } from "@/types/users";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useAtom, useAtomValue } from "jotai";
import { useEffect } from "react";
import toast from "react-hot-toast";


export function useRegisterUserByAdmin( reset?: () => void ) {
    const {accessToken} = useAtomValue(AuthSession);
    return useMutation({ 
        mutationFn: (data:IRegisterUserForm)=> registerUserbyAdminApi(data,accessToken??""),
        onSuccess: (data) => {
            toast.success(data.message || "User registered successfully!");
            reset?.();
        },
        
    });

}

export function useGetAllUsers() {
    const {accessToken} = useAtomValue(AuthSession);
    const [state,setState] = useAtom(UsersListingAtom)
    const query = useQuery({
        queryKey:["users"],
        queryFn: () => getAllUsersApi(state.count, accessToken ?? ""),
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        enabled: !!accessToken,
        retry:2,
        staleTime: 1000 * 60 * 5, 

    });

    useEffect(() => {
        if (query.status === "success" && query.data) {
            setState({
                ...state,
                users: query.data.payload.users,
                total : query.data.payload.total
            });
        }
        if (query.isError ) {
            if (query.error instanceof AxiosError) {
              toast.error(query.error.response?.data.message || "Failed to fetch users");   
            }
            }

        }, [query.status,query.data]);
        return query
}