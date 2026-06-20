'use server'

import { getAuthUser } from "@/lib/auth"
import connectDB from "@/lib/mongodb";
import HouseholdMember from "@/models/HouseholdMember";
import maintenanceItem from "@/models/maintenanceItem";

type numberItemsResult =
    | {success: false, error: string}
    | {success: true, number: number}

export const getNumberUncompletedMaintenanceItems = async (householdId: string) : Promise<numberItemsResult> => {
    try {
        const userId = await getAuthUser();
        if(!userId) return {success: false, error: "User's not authenticated"};

        await connectDB();

        const membership = await HouseholdMember.findOne({userId, householdId});
        if(!membership) return {success: false, error: "User is not a member of this household"};

        const number = await maintenanceItem.countDocuments({householdId, isCompleted: false});

        return {success: true, number};
    } catch(e) {
        console.error(e);
        return {success: false, error: "Error fetching maintenace items count"}
    }
}