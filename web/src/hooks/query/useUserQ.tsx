"use client"
import { FetchUserBasicDetailsApi, getAllUsersApi, GetUserPairs, IGetAllUsersPayload, registerUserbyAdminApi, ToggleBlockUserApi, updateUserByAdminApi } from "@/app/api/user.api";
import { UsersListingAtom } from "@/lib/atoms/users.atom";
import { IRegisterUserForm, IUpdateUserForm } from "@/types/users";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useAtom } from "jotai";
import { useParams,useRouter } from "next/navigation";
import toast from "react-hot-toast";


export function useRegisterUserByAdmin( reset?: () => void ) {
    return useMutation({ 
        mutationFn: (data:IRegisterUserForm)=> registerUserbyAdminApi(data),
        onSuccess: (data) => {
            toast.success(data.message || "User registered successfully!");
            reset?.();
        },
        
    });

}

export function useUpdateUserByAdmin(reset?: () => void) {
    const params = useParams()
    const user_id = params.id as string; 
    const router = useRouter()
    return useMutation({
        mutationFn: (data:IUpdateUserForm) => updateUserByAdminApi(user_id,data),
        onSuccess: (data) => {
            toast.success(data.payload.message || "User updated successfully!");
            reset?.();
            router.push("/dashboard/users");
            router.refresh();
        },
        onError: (error) => {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data.message || "Failed to update user");
            }
        }
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
            
            toast.success(!data.payload.user.is_blocked ? "User unblocked successfully" : "User blocked successfully")
        },
        onError(error){
            if (error instanceof AxiosError){
                toast.error(error.response?.data.message || "Internal server error");   
            }
        }

    });

 
    return query
}


export function useFetchBasicDetailsUser(){
    const params = useParams()
    const user_id = params.id as string;
    return useQuery({
        queryKey:["user","basic",user_id],
        queryFn: () => FetchUserBasicDetailsApi(user_id),
        staleTime: 1000 * 60 * 5, // 5 minutes
        refetchOnMount:false,
        refetchOnWindowFocus: false,
        retry:2
    })
}



export function useGetUserPairs(){
    return useQuery({
        queryKey:["users","pairs"],
        queryFn: GetUserPairs,
        staleTime: 1000 * 60 * 5, // 5 minutes
        refetchOnMount:false,
        refetchOnWindowFocus: false,
        retry:2
    })
}