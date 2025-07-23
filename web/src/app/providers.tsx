'use client'
import { ReactNode } from 'react'
import { QueryClient,QueryClientProvider } from "@tanstack/react-query"
import { Toaster } from 'react-hot-toast'

export const queryClient = new QueryClient()

export default function Providers({ children }: { children: ReactNode }) {
  return <QueryClientProvider client={queryClient}>
      <Toaster/>
    {children}
     </QueryClientProvider>
  
}
