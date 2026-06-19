'use client'

import { Plus } from "lucide-react";
import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import HouseholdCreationForm from './HouseholdCreationForm'

export default function CreateHouseholdCard() {
    const [openDialog,setOpenDialog] = useState(false);
    return (
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
                <button
                    className="w-100 h-50 rounded-[28px] border-2 border-dashed border-[#C8B9A8] bg-[#FEFCF3] flex flex-col items-center justify-center gap-4 transition cursor-pointer hover:scale-105"
                >
                    <div className="w-14 h-14 rounded-lg bg-[#F2EDE5] flex items-center justify-center -mt-1">
                        <Plus className="w-5 h-5 text-[#9B8C78]" strokeWidth={2.2} />
                    </div>
                    <div className="text-center">
                        <h3 className="text-xl font-bold text-[#1A140E]">Create a household</h3>
                        <p className="mt-1 text-sm text-[#A18F7A]">Start fresh and invite your roomies</p>
                    </div>
                </button>
            </DialogTrigger>
            <DialogContent className="bg-white rounded-3xl">
                <DialogHeader>
                    <DialogTitle>Create a household 🏠</DialogTitle>
                </DialogHeader>
                <HouseholdCreationForm onSuccess={() => setOpenDialog(false)} />
            </DialogContent>
        </Dialog>
    );
}