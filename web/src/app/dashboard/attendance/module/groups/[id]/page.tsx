'use client'

import { Button } from '@/shadcn/components/ui/button'
import { Users, Plus } from 'lucide-react'
import ModuleGroupUserSettingsFilterbar from './components/filterbar'
import ModuleGroupUsersLising from './components/module-group-users-lising'



export default function AttendanceModule() {



  return (
    <div className="">
      <div className=" mx-auto">
        <ModuleGroupUserSettingsFilterbar/>
        <ModuleGroupUsersLising/>
        
        

 

        {/* Empty State */}
        {
        [].length === 1 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12  mx-auto mb-4" />
            <h3 className="text-lg font-medium  mb-2">No groups found</h3>
            <p className="text-muted-foreground mb-4">
              {true ? 'No groups match your search' : 'Create your first group to get started'}
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Assign Group
            </Button>
          </div>
        )
        }
      </div>
    </div>
  )
}
