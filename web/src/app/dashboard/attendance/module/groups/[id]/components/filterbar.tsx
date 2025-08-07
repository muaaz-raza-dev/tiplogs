import { AttModuleGroupUserAssignmentAtom } from '@/lib/atoms/att-module.atom'
import { Button } from '@/shadcn/components/ui/button'
import { Input } from '@/shadcn/components/ui/input'
import { useSetAtom } from 'jotai'
import { Plus, Search } from 'lucide-react'
import React from 'react'

function ModuleGroupUserSettingsFilterbar() {
  const setAtomState = useSetAtom(AttModuleGroupUserAssignmentAtom)    
  return (
    <div className="mb-6 flex gap-4 items-center">
          <div className="relative flex-1 max-w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2  h-4 w-4" />
            <Input
              placeholder="Search groups..."
              className="pl-10"
            />
          </div>
          <Button variant={"secondary"} onClick={()=>setAtomState({group_selection_disabled:false,selected_group:"",selected_users:[],open_dialog:true})}>
            <Plus className="h-4 w-4 mr-2" />
            Add more Group
          </Button>
        </div>
  )
}

export default ModuleGroupUserSettingsFilterbar