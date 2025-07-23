import { Ring } from 'ldrs/react'
import 'ldrs/react/Ring.css'
import React from 'react'

function AppLoader() {
  return (
    <div className="w-screen h-screen flex items-center justify-center">

<Ring
  size="60"
  stroke="5"
  bgOpacity="0"
  speed="2"
  color="oklch(0.85 0.14 78)" 
/>
  </div>
  )
}

export default AppLoader