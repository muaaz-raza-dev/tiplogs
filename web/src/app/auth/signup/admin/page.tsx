"use client";

import React from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ISignupAdminForm, SignupAdminSchema } from "@/types/auth.t";

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
import { Checkbox } from "@/shadcn/components/ui/checkbox";
import { Eye, EyeOff, Mail, User, Lock } from "lucide-react";
import Link from "next/link";
import { useSignUpAdminQ } from "@/hooks/query/useAuthQ";
import { AxiosError } from "axios";
import ServerRequestLoader from "@/components/loaders/server-request-loader";

export default function RegistrationPage() {
  const [showPassword, setShowPassword] = React.useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<ISignupAdminForm>({
    resolver: zodResolver(SignupAdminSchema),
  });
  
  const {mutate,error,isPending:isLoading} = useSignUpAdminQ({ reset })
  const axiosError = error as AxiosError<{ message: string }>

  const onSubmit = (data: ISignupAdminForm) => {
    
    mutate(data);

  };

  return (
    <div className="relative z-10 ">
      <Card className="w-full max-w-md shadow-2xl border  backdrop-blur-md">
        <CardHeader className="space-y-1 relative">
          <CardTitle className="text-2xl font-bold text-center text-white">
            Create an account
          </CardTitle>
          <CardDescription className="text-center text-gray-300">
            Enter your details below to create your account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="firstName" className="text-gray-200 pb-1.5">
                Full Name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  {...register("full_name")}
                  id="firstName"
                  type="text"
                  placeholder="John"
                  className="pl-10 "
                />
              </div>
              {errors.full_name && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.full_name.message}
                </p>
              )}
            </div>
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
              <Label htmlFor="email" className="text-gray-200 pb-1.5">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  {...register("email")}
                  id="email"
                  type="email"
                  placeholder="john.doe@example.com"
                  className="pl-10 bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 "
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.email.message}
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

            
            <div className="flex items-center gap-2">
              <Controller
                control={control}
                name="terms"
                
                defaultValue={false}
                render={({ field }) => (
                  <Checkbox
                    id="terms"
                    className="border-gray-600   mt-1"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <Label htmlFor="terms" className="text-sm text-center  text-gray-300">
                I agree to the{" "}
                <Link
                  href="/terms"
                  className="font-bold underline"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="font-bold underline"
                >
                  Privacy Policy
                </Link>
              </Label>
            </div>
            {errors.terms && (
              <p className="text-xs text-red-500 mt-1">
                {errors.terms.message}
              </p>
            )}

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
              Create account
              </>
              }
            </Button>
          </form>
        </CardContent>

        <CardFooter>
          <div className="text-center text-sm text-gray-400 w-full">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="text-accent hover:accent-accent-foreground underline font-medium"
            >
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
