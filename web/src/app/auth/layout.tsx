import React from 'react'
import { AuthNavbar } from './navbar'

function layout({  children,
}: Readonly<{   children: React.ReactNode }>) {
  return (
     <div className="min-h-screen relative flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden bg-background">
        <AuthNavbar />
      {children}
      </div>
  )
}

export default layout