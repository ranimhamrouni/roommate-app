'use server'

import { getAuthUser } from "@/lib/auth";
import connectDB from "@/lib/mongodb"
import CalendarEvent from "@/models/CalendarEvent";
import HouseholdMember from "@/models/HouseholdMember";

type eventsNumberResult = 
    | {success: false, error: string}
    | {success: true, count: number}

export const getNumberEvents = async (householdId: string) : Promise<eventsNumberResult> => {
    try{
        const userId = await getAuthUser();
        if(!userId) return {success: false, error: "User not authenticated"};

        await connectDB();

        const membership = await HouseholdMember.findOne({userId, householdId});
        if(!membership) return {success: false, error: "User is not a member of this household"};
        
        const now = new Date()
        const startOfWeek = new Date(now)
        startOfWeek.setDate(now.getDate() - now.getDay())
        startOfWeek.setHours(0, 0, 0, 0)
        const endOfWeek = new Date(startOfWeek)
        endOfWeek.setDate(startOfWeek.getDate() + 6)
        endOfWeek.setHours(23, 59, 59, 999)
        
        const count = await CalendarEvent.countDocuments({householdId, date: { $gte: startOfWeek, $lte: endOfWeek }})
        return {success: true, count}
    } catch(e) {
        console.error(e);
        return {success: false, error: "Error fetching events number"}
    }
}