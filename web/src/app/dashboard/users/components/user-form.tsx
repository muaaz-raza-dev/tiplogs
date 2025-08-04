"use client"

import { Button } from "@/shadcn/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shadcn/components/ui/card"
import { Input } from "@/shadcn/components/ui/input"
import { Label } from "@/shadcn/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shadcn/components/ui/select"
import {  User, Mail, Lock, UserCheck, AtSign } from "lucide-react"
import { Controller, useForm } from "react-hook-form"
import { IRegisterUserForm, IUpdateUserForm, RegisterUserSchema, UpdateUserSchema } from "@/types/users"
import { zodResolver } from "@hookform/resolvers/zod"
import { user_roles } from "@/types/users"
import { useRegisterUserByAdmin, useUpdateUserByAdmin } from "@/hooks/query/useUserQ"
import ServerRequestLoader from "@/components/loaders/server-request-loader"
import { AxiosError } from "axios"

export default function UserForm({edit=false,defaultValues}:{edit:boolean,defaultValues?:IUpdateUserForm}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<IRegisterUserForm| IUpdateUserForm>({
    resolver: zodResolver(edit ? UpdateUserSchema : RegisterUserSchema),
    defaultValues :edit ? defaultValues: { role: user_roles[1],},
  });
  const {mutate:update ,isPending:isUpdating,isError:isUpdateError,error:updateError} = useUpdateUserByAdmin(reset)
  const {mutate,isPending,isError,error}=useRegisterUserByAdmin(reset)
  const Error = error as AxiosError<{ message: string }>
  const UpdateError = error as AxiosError<{ message: string }>

  const onSubmit = (data: IRegisterUserForm|IUpdateUserForm) => {
    if (edit) {
      update(data as IUpdateUserForm);

    }
    else{
        mutate(data as IRegisterUserForm);
    }
  };
  return (
    <div className="h-full flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Create New User</CardTitle>
          <CardDescription className="text-center">Fill in the details to create a new user account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}  className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="flex items-center gap-2">
                <AtSign className="h-4 w-4" />
                Username
              </Label>
              <Input
                {...register("username")}
                id="username"
                name="username"
                type="text"
                placeholder="johndoe"
                required
                className="pl-3"
              />
               {errors.username && (
              <p className="text-xs text-red-500 mt-1">
                {errors.username.message}
              </p>
            )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Full Name
              </Label>
              <Input
              {...register("full_name")}
                type="text"
                placeholder="John Doe"
                className="pl-3"
              />
               {errors.full_name && (
              <p className="text-xs text-red-500 mt-1">
                {errors.full_name.message}
              </p>
            )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email
              </Label>
              <Input
              {...register("email")}
                id="email"
                name="email"
                type="email"
                placeholder="john@example.com"
                required
                className="pl-3"
              />
               {errors.email && (
              <p className="text-xs text-red-500 mt-1">
                {errors.email.message}
              </p>
            )}
              
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Password
              </Label>
              <Input
              {...register("password")}
                id="password"
                name="password"
                type="text"
                placeholder="••••••••"
                required={!edit}
                className="pl-3"
              />
                {edit? 
              <p className="text-orange-500 text-xs">
                    Leave the password field empty if you don't want to change the password
              </p>
                : null}
               {errors.password && (
              <p className="text-xs text-red-500 mt-1">
                {errors.password.message}
              </p>
            )}
            </div>

            <div className="space-y-2">
                
              <Label htmlFor="role" className="flex items-center gap-2">
                <UserCheck className="h-4 w-4" />
                Role
              </Label>

                <Controller control={control} name="role" render={({field,fieldState})=>{
                    return <>
                    <Select  value={field.value} onValueChange={field.onChange} >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>

                <SelectContent>
                     {user_roles.slice(1).map((role) => (
                         <SelectItem key={role} value={role}>
                            {role}
                        </SelectItem>))
}
                </SelectContent>
              </Select>
                
                 {fieldState.error && (
                     <p className="text-xs text-red-500 mt-1">
                  {fieldState.error.message}
                </p>
              )}
              </>
                }} />

            </div>

                { 
                
                 isError||isUpdateError && (
                     <p className="text-xs text-red-500 mt-1">
                  {Error?.response?.data.message||UpdateError?.response?.data.message || "An error occurred while creating the user."}
                </p> ) 


                }

            <Button type="submit" className="w-full"  disabled={isPending||isUpdating}>

                { 
                    isPending|| isUpdating ? <ServerRequestLoader/>  : edit ? "Save changes" : "Create User"
                }

            </Button>

          </form>


        </CardContent>
      </Card>
    </div>
  )
}
