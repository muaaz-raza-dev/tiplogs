

import { Ring } from 'ldrs/react'
import 'ldrs/react/Ring.css'

import React from 'react'
function ServerRequestLoader({size,stroke,color}:{size?: number;stroke?:number,color?: string}) {
  return (

// Default values shown
<Ring
  size={size || 20}
  stroke={stroke||2.5}
  bgOpacity="0"
  speed="2"
  color={color||"oklch(0.35 0.1 78)" }
/>
  )
}

export default ServerRequestLoader
