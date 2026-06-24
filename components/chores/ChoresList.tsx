'use client'
import { useState } from "react"
import { PopulatedChore, toggleChoreStatus } from "@/actions/chores";
import { Checkbox } from "../ui/checkbox"
import Initials from "../home/Initials"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import ChoreCreationForm from "@/components/chores/ChoreCreationForm"
import { PopulatedHouseholdMember } from "@/actions/householdMember";

const ChoresList = ({userId, householdId, members, choresArray} : {userId: string, householdId: string, members: PopulatedHouseholdMember[], choresArray : PopulatedChore[]}) => {
    const [filter, setFilter] = useState<'All' | 'Mine' | 'Completed'>('All');
    const [chores, setChores] = useState(choresArray);
    const [openDialog, setOpenDialog] = useState(false);
    const handleToggle = async (choreId: string) => {
        const previousChores = chores;

        setChores(prev => prev.map(c => 
            c._id.toString() == choreId 
                ? {...c, status: c.status=='Pending'? 'Done' : 'Pending'}
                : c
        ))

        const result = await toggleChoreStatus(choreId);
        if(!result.success) setChores(previousChores);
    }

    const myChores = chores.filter(c => c.assignedTo._id.toString() == userId);
    const completedChores = chores.filter(c => c.status == 'Done');
    const displayChores =
        filter === "All" ? chores : filter === "Mine" ? myChores : completedChores

    const filters: { label: typeof filter; count: number }[] = [
        { label: "All", count: chores.length },
        { label: "Mine", count: myChores.length },
        { label: "Completed", count: completedChores.length },
    ]

    return (
    <div className="w-full">
        <div className="mb-6 flex items-center justify-between gap-2">
        <div className="flex gap-2">
            {filters.map((f) => (
            <button
                key={f.label}
                onClick={() => setFilter(f.label)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                filter === f.label
                    ? "bg-gray-900 text-white"
                    : "bg-[#F0EAD6] text-gray-600 hover:bg-[#E8DFC4]"
                }`}
            >
                {f.label} {f.count}
            </button>
            ))}
        </div>

        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
            <button className="rounded-full bg-[#4CAF6D] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#429960]">
                + Add Chore
            </button>
            </DialogTrigger>
            <DialogContent className="bg-white rounded-[28px] sm:max-w-md">
            <DialogHeader>
                <DialogTitle>Add a chore</DialogTitle>
            </DialogHeader>
            <ChoreCreationForm
                householdId={householdId}
                members={members}
                onSuccess={() => setOpenDialog(false)}
            />
            </DialogContent>
        </Dialog>
        </div>

        {displayChores.length === 0 ? (
        <div className="rounded-[28px] bg-[#FFFFFF] p-10 text-center text-sm text-gray-500">
            No chores here.
        </div>
        ) : (
        <div className="flex flex-col gap-3">
            {displayChores.map((chore) => {
            const isDone = chore.status === "Done"
            const assigneeName = chore.assignedTo?.name ?? "Unassigned"

            return (
                <div
                key={chore._id.toString()}
                className="flex items-center gap-4 rounded-2xl bg-[#FFFFFF] px-5 py-4"
                >
                <Checkbox
                    checked={isDone}
                    onCheckedChange={() => handleToggle(chore._id.toString())}
                    className="h-5 w-5 rounded-md bg-[#F5F0E6]"
                />

                <div className="min-w-0 flex-1">
                    <p className={`text-sm font-medium ${isDone ? "text-gray-400 line-through" : "text-brown-800"}`}>
                    {chore.title}
                    </p>
                    {chore.description && (
                    <p className="truncate text-xs text-gray-400">{chore.description}</p>
                    )}
                </div>

                <span className="hidden rounded-full bg-[#F0EAD6] px-3 py-1 text-xs font-medium text-gray-600 sm:inline-block">
                    {chore.frequency}
                </span>

                <div className="flex items-center gap-2">
                    <Initials name={assigneeName} />
                </div>

                <span
                    className="rounded-full px-3 py-1 text-xs font-semibold"
                    style={{
                    backgroundColor: isDone ? "#E5F4E3" : "#FDF1D9",
                    color: isDone ? "#3B6D11" : "#854F0B",
                    }}
                >
                    {isDone ? "Done" : "Pending"}
                </span>
                </div>
            )
            })}
        </div>
        )}
    </div>
    )
}

export default ChoresList
