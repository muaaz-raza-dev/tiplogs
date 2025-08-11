import { MarkAttendanceAtom, MarkAttendanceListAtom } from "@/lib/atoms/mark-att.atom";
import { Button } from "@/shadcn/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shadcn/components/ui/dialog"
import { Label } from "@/shadcn/components/ui/label";
import { Textarea } from "@/shadcn/components/ui/textarea";
import { useAtom } from "jotai";
import { useEffect, useState } from "react"
export function AttNoteDialog({noteState,}:{noteState:{index:number;note:string},}){
    const[open,setOpen] =useState(false)
    const [note,setNote] = useState("")
    const [att,setAtt] = useAtom(MarkAttendanceListAtom)
    useEffect(() => {
        if (noteState.index!=-1){
            setOpen(true)
            setNote(noteState.note)
        }
    }, [noteState])
    function onSave(){
        const attendances = att.map((e,index)=>{
            if(index==noteState.index){
                return {...e,att_note:note}
            }
                return e
        })
        setAtt(attendances)
        setOpen(false)
    }
    return <Dialog open={open} onOpenChange={(o)=>setOpen(o)}>
        <DialogContent>
                <DialogHeader className="">
          <DialogTitle>Attendance note</DialogTitle>
          <DialogDescription id="attendance-note-desc">Write the note on individual attendance either for its leave or somethig else</DialogDescription>
        </DialogHeader>
        <div className="">
            <Label className="py-2">
                Attedance Note
            </Label>
            <Textarea value={note} onChange={({target:{value}})=>setNote(value)} maxLength={128} rows={5} />
            <p className="text-xs text-right py-2 text-muted-foreground">{note.length}/128</p>
        </div>
        <DialogFooter>
        <Button variant={"outline"} onClick={()=>setOpen(false)}>Cancel</Button>
        <Button variant={"default"} onClick={onSave}>Save</Button>
        </DialogFooter>
        </DialogContent>
    </Dialog>
}