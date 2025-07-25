"use client"

import { Button } from "@/shadcn/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shadcn/components/ui/card"
import { Input } from "@/shadcn/components/ui/input"
import { Label } from "@/shadcn/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shadcn/components/ui/select"
import {  User, Mail, Lock, UserCheck, AtSign } from "lucide-react"
import { Controller, useForm } from "react-hook-form"
import { IRegisterUserForm, RegisterUserSchema } from "@/types/users"
import { zodResolver } from "@hookform/resolvers/zod"
import { user_roles } from "@/types/users"
import { useRegisterUserByAdmin } from "@/hooks/query/useUserQ"
import ServerRequestLoader from "@/components/loaders/server-request-loader"
import { AxiosError } from "axios"

export default function CreateUserForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<IRegisterUserForm>({
    resolver: zodResolver(RegisterUserSchema),defaultValues:{role:"user"}
  });
  
  const {mutate,isPending,isError,error}=useRegisterUserByAdmin(reset)
  const Error = error as AxiosError<{ message: string }>

  const onSubmit = (data: IRegisterUserForm) => {
    mutate(data);
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
                required
                className="pl-3"
              />
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

                <Controller control={control} name="role" render={(val)=>{
                    return <>
                    <Select  value={val.field.value} onValueChange={val.field.onChange} >
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
                
                 {val.fieldState.error && (
                     <p className="text-xs text-red-500 mt-1">
                  {val.fieldState.error.message}
                </p>
              )}
              </>
                }} />

            </div>

                {isError && (
                     <p className="text-xs text-red-500 mt-1">
                  {Error.response?.data.message || "An error occurred while creating the user."}
                </p>
              )}

            <Button type="submit" className="w-full"  disabled={isPending}>

                { 
                    isPending ? <ServerRequestLoader/>  : "Create User"
                }

            </Button>

          </form>


        </CardContent>
      </Card>
    </div>
  )
}
