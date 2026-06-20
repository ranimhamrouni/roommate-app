'use server'
import { getAuthUser } from "@/lib/auth"
import connectDB from "@/lib/mongodb";
import HouseholdMember, { IHouseholdMember } from "@/models/HouseholdMember";

type PopulatedHouseholdMember = Omit<IHouseholdMember, 'userId'> & {
    userId: { _id: string; name: string; avatar?: string }
}

type householdMembersResult =
    | {success: false, error: string}
    | {success: true, members: PopulatedHouseholdMember[]}

export const getHouseholdMembers = async (householdId: string) : Promise<householdMembersResult> => {
    try{
        const userId = await getAuthUser();
        if(!userId) return {success: false, error: "User's not authenticated"};

        await connectDB();

        const membership = await HouseholdMember.findOne({userId, householdId});
        if(!membership) return {success: false, error: "User is not a member of this hosuehold"};

        const members = await HouseholdMember.find({householdId}).populate('userId', 'name avatar');

        return {success: true, members}
    } catch(e) {
        console.error(e);
        return {success: false, error: "Error fetching household members"};
    }
}