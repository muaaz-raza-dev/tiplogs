"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ILoginForm,LoginSchema } from "@/types/auth.t";

import { Button } from "@/shadcn/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shadcn/components/ui/card";
import { Input } from "@/shadcn/components/ui/input";
import { Label } from "@/shadcn/components/ui/label";
import { Eye, EyeOff, User, Lock } from "lucide-react";
import { AxiosError } from "axios";
import ServerRequestLoader from "@/components/loaders/server-request-loader";
import { useLogin, useSignUpAdminQ } from "@/hooks/query/auth/useAuthQ";

export default function LoginPage() {
  const [showPassword, setShowPassword] = React.useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    
  } = useForm<ILoginForm>({
    resolver: zodResolver(LoginSchema),
  });
  
  const {mutate,error,isPending:isLoading} = useLogin({ reset })
  const axiosError = error as AxiosError<{ message: string }>

  const onSubmit = (data: ILoginForm) => {
    mutate(data)

  };

  return (
    <div className="relative z-10 ">
      <Card className="w-xl max-md:w-full  shadow-2xl border  backdrop-blur-md">
        <CardHeader className="space-y-1 relative">
          <CardTitle className="text-2xl font-bold text-center text-white">
            Login 
          </CardTitle>
          <CardDescription className="text-center text-gray-300">
            Enter your details below to access your account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
    
              <div>
              <Label htmlFor="username" className="text-gray-200 pb-1.5">
                Username 
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  {...register("username")}
                  id="username"
                  type="text"
                  placeholder="johny"
                  className="pl-10 bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 "
                />
              </div>
              {errors.username && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.username.message}
                </p>
              )}
            </div>
          

            <div>
              <Label htmlFor="password" className="text-gray-200 pb-1.5">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  {...register("password")}
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="pl-10 pr-10 bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 "
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-gray-700/50 text-gray-400 hover:text-gray-200 pb-1.5"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            
           
          

            {axiosError && (
              <p className="text-xs text-center text-red-500 mt-1">
                { axiosError.response?.data.message || "An error occurred" }
              </p>
            )}

            <Button
              type="submit"
              className="w-full cursor-pointer hover:opacity-95 "
              disabled={isLoading}
            >
              {isLoading?
              <ServerRequestLoader/>:
              <>
              Login
              </>
              }
            </Button>
          </form>
        </CardContent>

        <CardFooter>
        
        </CardFooter>
      </Card>
    </div>
  );
}
