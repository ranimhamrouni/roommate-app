'use server'
import { getAuthUser } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Chore, { IChore } from "@/models/Chore";
import HouseholdMember from "@/models/HouseholdMember";

type choresNumberResult = 
    | {success: false, error: string}
    | {success: true, number: number}

export type PopulatedChore = Omit<IChore, 'createdBy' | 'assignedTo'> & {
    createdBy: {_id: string; name: string; avatar?: string},
    assignedTo: {_id: string; name: string; avatar?: string}
}

type choresResult = 
    | {success: false, error: string}
    | {success: true, chores: PopulatedChore[]}

type choreToggleResult =
    | {success: false, error: string}
    | {success: true}

type choreCreationResult =
    | {success: false, error: string}
    | {success: true, chore: PopulatedChore}

export const getNumberPendingChores = async (householdId: string) : Promise<choresNumberResult> => {
    try{
        const userId = await getAuthUser();
        if(!userId) return {success: false, error: "User not authenticated"};

        await connectDB();

        const membership = await HouseholdMember.findOne({userId, householdId});
        if(!membership) return {success: false, error: "User is not a member of this household"};

        const number = await Chore.countDocuments({householdId, status: 'Pending'});
        return {success: true, number}
    } catch(e) {
        console.error(e);
        return {success: false, error: "Error calculating pending chores number"}
    }
}

export const getChores = async (householdId: string) : Promise<choresResult> => {
    try{
        const userId = await getAuthUser();
        if(!userId) return {success: false, error: "User's not authenticated"};

        await connectDB();

        const membership = await HouseholdMember.findOne({userId, householdId});
        if(!membership) return {success: false, error: "User is not a member of this household"};

        const chores = await Chore.find({ householdId }).populate('assignedTo', 'name avatar').lean()

        return {success: true, chores: JSON.parse(JSON.stringify(chores))};
    } catch(e) {
        console.error(e);
        return {success: false, error: "Error fetching chores"};
    }
}

export const toggleChoreStatus = async (choreId: string) : Promise<choreToggleResult> => {
    try{
        const userId = await getAuthUser();
        if(!userId) return {success: false, error: "User's not authenticated"};

        await connectDB();

        const chore = await Chore.findById(choreId);
        if(!chore) return {success: false, error: "Chore not found"};
        const membership = await HouseholdMember.findOne({userId, householdId: chore.householdId})
        if(!membership) return {success: false, error: "User is not a member of this household"};

        if(chore.status == 'Pending') {
            chore.status = 'Done';
            chore.completedAt = new Date();
        }
        else {
            chore.status = 'Pending';
            chore.completedAt = undefined;
        }
        await chore.save()
        return {success: true}
    } catch(e) {
        console.error(e);
        return{success: false, error: "Error fetching chore and toggling status"}
    }
}

export const createChore = async ( householdId: string, title: string, description: string, frequency: string, assignedTo: string ) : Promise<choreCreationResult> => {
    try{
        const userId = await getAuthUser();
        if(!userId) return {success: false, error: "User's not authenticated"};

        await connectDB();

        const chore = await Chore.create({householdId, title, description, frequency, assignedTo, createdBy: userId});
        await chore.populate('assignedTo', 'name avatar');
        await chore.populate('createdBy', 'name avatar');
        const plainChore = JSON.parse(JSON.stringify(chore));
        return {success: true, chore: plainChore}
    } catch(e) {
        console.error(e);
        return {success: false, error:"Error creating chore"}
    }
}