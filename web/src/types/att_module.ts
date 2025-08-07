import z from "zod"

export const CreateAttModuleformSchema = z.object({
  name: z.string().min(3, "Module name is required"),
  description: z.string().optional(),
  frequency: z.enum(["daily", "custom"], { error: "Frequency is required" }),
  groups: z.array(z.string()).min(1, "Please select at least one group"),
})

export type ICreateAttModuleform = z.infer<typeof CreateAttModuleformSchema>




export interface IgroupUserAssignmentDialogAtomState{
  selected_group:string;
  group_selection_disabled:boolean;
  selected_users:string[];
  open_dialog:boolean
}