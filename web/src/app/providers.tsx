'use client'

import { RecoilRoot } from 'recoil'
import { ReactNode } from 'react'
import { QueryClient,QueryClientProvider } from "@tanstack/react-query"

export const queryClient = new QueryClient()

export default function Providers({ children }: { children: ReactNode }) {
  return <RecoilRoot>
     <QueryClientProvider client={queryClient}>
    {children}
     </QueryClientProvider>
    </RecoilRoot>
  
}
