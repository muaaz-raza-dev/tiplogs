import { useGetGroupPairs } from '@/hooks/query/useGroupQ'
import { Button } from '@/shadcn/components/ui/button'
import { Input } from '@/shadcn/components/ui/input'
import { Plus, Search } from 'lucide-react'
import React from 'react'
import AddGroupDialog from './add-group-dialog'

function ModuleGroupUserSettingsFilterbar() {
    const {data,isPending} = useGetGroupPairs()
  return (
    <div className="mb-6 flex gap-4 items-center">
          <div className="relative flex-1 max-w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2  h-4 w-4" />
            <Input
              placeholder="Search groups..."
              className="pl-10"
            />
          </div>
          <AddGroupDialog>
          <Button variant={"secondary"}>
            <Plus className="h-4 w-4 mr-2" />
            Add more Group
          </Button>
          </AddGroupDialog>
        </div>
  )
}

export default ModuleGroupUserSettingsFilterbar