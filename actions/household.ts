'use server'
import { getAuthUser } from "@/lib/auth"
import {z} from 'zod'
import Household, {IHousehold} from '@/models/Household'
import HouseholdMember from "@/models/HouseholdMember"
import connectDB from "@/lib/mongodb"

type HouseholdResult = 
    | {success: true}
    | {success: false, error: string}

type HouseholdListResult =
    | {success: true, households: IHousehold[]}
    | {success: false, error: string}

type HouseholdIdResult =
    | {success: true, householdId: string}
    | {success: false, error: string}

const createHouseholdSchema = z.object({
    name: z.string().min(2,'Name must be at least 2 characters long'),
})

const joinHouseholdSchema = z.object({
    inviteCode: z.string().length(6,"Invite Code must be 6 characters long")
})

export const createHousehold = async(name : string, address: string, emoji: string) : Promise<HouseholdResult> => {
    try {
        const userId = await getAuthUser();
        if(!userId) return {success: false, error: "User not authenticated"};

        await connectDB();

        const result = createHouseholdSchema.safeParse({name});
        if(!result.success) return {success: false , error: result.error.issues[0].message};

        const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        const household = await Household.create({name, address, emoji, inviteCode, createdBy: userId});
        await HouseholdMember.create({householdId: household._id, userId});
        return {success: true}
    } catch(e) {
        console.error(e);
        return {success: false, error: "Error creating household"};
    }
}

export const joinHousehold = async (inviteCode: string) : Promise<HouseholdResult> => {
    try {
        const userId = await getAuthUser();
        if(!userId) return {success: false, error: "User not authenticated"};

        await connectDB();

        const result = joinHouseholdSchema.safeParse({inviteCode});
        if(!result.success) return {success: false, error: result.error.issues[0].message};

        const household = await Household.findOne({inviteCode});
        if(!household) return {success: false, error: "Invite Code doesn't exist"};
        let householdMember = await HouseholdMember.findOne({householdId: household._id, userId});
        if(householdMember) return {success: false, error: "User already belongs to household"};
        householdMember= await HouseholdMember.create({householdId: household._id, userId});

        return {success:  true};
    } catch(e) {
        console.error(e);
        return {success: false, error: "Error joining household"};
    }
}

export const getUserHouseholds = async () : Promise<HouseholdListResult> => {
    try{
        const userId = await getAuthUser();
        if(!userId) return {success: false, error: "User not authenticated"};

        await connectDB();

        const memberships = await HouseholdMember.find({ userId }).populate('householdId');
        
        const households = memberships.map((membership) => membership.householdId);

        return {success: true, households}
    } catch(e) {
        console.error(e);
        return {success: false, error: "Error fetching households"}
    }
}

export const getHouseholdIdByInviteCode = async (inviteCode: string) : Promise<HouseholdIdResult> => {
    try {
        await connectDB();

        const household = await Household.findOne({inviteCode});

        if(!household) return {success: false, error: "Household not found"}
        return {success: true, householdId: household._id.toString()};
    } catch(e) {
        console.error(e);
        return {success: false, error: "Error fetching Id"}
    }
}

type HouseholdDataResult =
    | {success: true, household: IHousehold}
    | {success: false, error: string}

export const getHouseholdById = async (id: string) : Promise<HouseholdDataResult> => {
    try {
        await connectDB();

        const household = await Household.findById(id);
        if(!household) return {success: false, error: 'Household not found'};
        const userId = await getAuthUser();
        if (!userId) return { success: false, error: 'Not authenticated' };
        const membership = await HouseholdMember.findOne({userId, householdId: household._id});
        if(!membership) return {success: false, error: "User not a member of this household"};
        return {success: true, household};
    } catch(e) {
        console.error(e);
        return {success: false, error: 'Error fetching household'};
    }
}