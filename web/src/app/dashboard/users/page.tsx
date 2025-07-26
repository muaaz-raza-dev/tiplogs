"use client"

import UsersTable from "./components/users_table"
import UsersFilterBar from "./components/users_filterbar"


export default function Component() {


 

 
  return (
<div className="space-y-6">
      <UsersFilterBar/>
      <UsersTable/>
      </div>
  )
}

