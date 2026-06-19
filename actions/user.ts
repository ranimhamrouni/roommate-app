'use server'

import { getAuthUser } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import User, { IUser } from "@/models/User";

type UserResult = (
    | {success: false, error: string}
    | {success: true, user: IUser}
)

export const getUser= async () : Promise<UserResult> => {
    try{
        const userId = await getAuthUser();
        if(!userId) return {success: false, error: "Error fetching User"};

        await connectDB();

        const user = await User.findById(userId).select('name email avatar');

        return {success: true, user}
    } catch(e) {
        console.error(e);
        return {success: false, error: "Error fetching User"};
    }
} 