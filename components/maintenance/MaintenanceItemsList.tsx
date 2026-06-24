'use client'
import { useState } from "react";
import { PopulatedItem, toggleItemStatus } from "@/actions/maintenance";
import { Checkbox } from "../ui/checkbox"
import Initials from "../home/Initials"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import ItemCreationForm from "@/components/maintenance/ItemCreationForm"

const MaintenanceItemsList = ({householdId, itemsArray} : {householdId: string, itemsArray : PopulatedItem[]}) => {
    const [filter, setFilter] = useState<'All' | 'Completed'>('All');
    const [items, setItems] = useState(itemsArray);
    const [openDialog, setOpenDialog] = useState(false);

    const handleToggle = async (itemId: string) => {
        const previousItems = items;

        setItems(prev => prev.map(i => 
            i._id.toString() == itemId 
                ? {...i, isCompleted: i.isCompleted==false? true : false}
                : i
        ))

        const result = await toggleItemStatus(itemId);
        if(!result.success) setItems(previousItems);
    }


    const completedItems = items.filter(i => i.isCompleted == true);
    const displayItems =
        filter === "All" ? items : completedItems

    const filters: { label: typeof filter; count: number }[] = [
        { label: "All", count: items.length },
        { label: "Completed", count: completedItems.length },
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
                + Add Item
            </button>
            </DialogTrigger>
            <DialogContent className="bg-white rounded-[28px] sm:max-w-md">
            <DialogHeader>
                <DialogTitle>Add an Item</DialogTitle>
            </DialogHeader>
            <ItemCreationForm
                householdId={householdId}
                onSuccess={() => setOpenDialog(false)}
            />
            </DialogContent>
        </Dialog>
        </div>

        {displayItems.length === 0 ? (
        <div className="rounded-[28px] bg-[#FFFFFF] p-10 text-center text-sm text-gray-500">
            No items here.
        </div>
        ) : (
        <div className="flex flex-col gap-3">
            {displayItems.map((item) => {
            const isCompleted = item.isCompleted === true
        
            return (
                <div
                key={item._id.toString()}
                className="flex items-center gap-4 rounded-2xl bg-[#FFFFFF] px-5 py-4"
                >
                <Checkbox
                    checked={isCompleted}
                    onCheckedChange={() => handleToggle(item._id.toString())}
                    className="h-5 w-5 rounded-md bg-[#F5F0E6]"
                />

                <div className="min-w-0 flex-1">
                    <p className={`text-sm font-medium ${isCompleted ? "text-gray-400 line-through" : "text-brown-800"}`}>
                    {item.name}
                    </p>
                </div>
                {isCompleted ? (
                <div className="flex items-center gap-2">
                    Completed At:
                    <span>
                    {item.completedAt
                        ? new Date(item.completedAt).toLocaleDateString('en-TN')
                        : 'Unknown'}
                    </span>
                </div>
                ) : (
               <div className="flex items-center gap-2">
                    Added By: <Initials name={item.addedBy?.name ?? 'Unknown'} />
                </div>
                )}
                
                <span
                    className="rounded-full px-3 py-1 text-xs font-semibold"
                    style={{
                    backgroundColor: isCompleted ? "#E5F4E3" : "#FDF1D9",
                    color: isCompleted ? "#3B6D11" : "#854F0B",
                    }}
                >
                    {isCompleted ? "Purchased" : "Not purchased"}
                </span>
                </div>
            )
            })}
        </div>
        )}
    </div>
    )
}

export default MaintenanceItemsList;
