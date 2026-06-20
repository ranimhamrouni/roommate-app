'use server'
import { getAuthUser } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Chore from "@/models/Chore";
import HouseholdMember from "@/models/HouseholdMember";

type choresNumberResult = 
    | {success: false, error: string}
    | {success: true, number: number}


export const getNumberPendingChores = async (householdId: string) : Promise<choresNumberResult> => {
    try{
        const userId = await getAuthUser();
        if(!userId) return {success: false, error: "User not authenticated"};

        await connectDB();

        const membership = await HouseholdMember.findOne({userId, householdId});
        if(!membership) return {success: false, error: "User is not a member of this household"};

        const number = await Chore.countDocuments({householdId, status: 'pending'});
        return {success: true, number}
    } catch(e) {
        console.error(e);
        return {success: false, error: "Error calculating pending chores number"}
    }
}