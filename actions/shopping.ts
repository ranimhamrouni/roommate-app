'use server'

import { getAuthUser } from "@/lib/auth"
import connectDB from "@/lib/mongodb";
import HouseholdMember from "@/models/HouseholdMember";
import ShoppingItem from "@/models/ShoppingItem";

type numberItemsResult =
    | {success: false, error: string}
    | {success: true, number: number}

export const getNumberToBuyItems = async (householdId: string) : Promise<numberItemsResult> => {
    try{
        const userId = await getAuthUser();
        if(!userId) return {success: false, error: "User's not authenticated"}

        await connectDB();

        const membership = await HouseholdMember.findOne({userId, householdId});
        if(!membership) return {success: false, error: "User is not a member of this household"}

        const number = await ShoppingItem.countDocuments({householdId, isPurchased: false});

        return {success: true, number}
    } catch(e) {
        console.error(e);
        return {success: false, error: "Error fetching shopping items count"}
    }
}