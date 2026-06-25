'use server'

import { getAuthUser } from "@/lib/auth"
import connectDB from "@/lib/mongodb";
import HouseholdMember from "@/models/HouseholdMember";
import MaintenanceItem from "@/models/MaintenanceItem";
import ShoppingItem, { IMaintenanceItem } from "@/models/MaintenanceItem";

export type PopulatedItem = Omit<IMaintenanceItem, 'addedBy'> & {
    addedBy: { _id: string, name: string, avatar?: string},
}

type numberItemsResult =
    | {success: false, error: string}
    | {success: true, number: number}

type itemsResult =
    | {success: false, error: string}
    | {success: true, items: PopulatedItem[]}

type creationResult =
    | {success: false, error: string}
    | {success: true, item: IMaintenanceItem}

type itemToggleResult =
    | {success: false, error: string}
    | {success: true}

export const getNumberUncompletedMaintenanceItems  = async (householdId: string) : Promise<numberItemsResult> => {
    try{
        const userId = await getAuthUser();
        if(!userId) return {success: false, error: "User's not authenticated"}

        await connectDB();

        const membership = await HouseholdMember.findOne({userId, householdId});
        if(!membership) return {success: false, error: "User is not a member of this household"}

        const number = await MaintenanceItem.countDocuments({householdId, isCompleted: false});

        return {success: true, number}
    } catch(e) {
        console.error(e);
        return {success: false, error: "Error fetching shopping items count"}
    }
}

export const getItems = async (householdId: string) : Promise<itemsResult> => {
    try{
        const userId = await getAuthUser();
        if(!userId) return {success: false, error: "User's not authenticated"};

        await connectDB();

        const membership = await HouseholdMember.find({userId, householdId});
        if(!membership) return {success: false, error: "User is not a member of this household"};

        const items = await MaintenanceItem.find({householdId}).populate('addedBy','name').lean();

        return {success: true, items: JSON.parse(JSON.stringify(items))}
    } catch(e) {
        console.error(e);
        return {success: false, error: "Error fetching maintenace items"};
    }
}

export const createItem = async (householdId: string, name: string, description: string) : Promise<creationResult> => {
    try{
        const userId = await getAuthUser();
        if(!userId) return {success: false, error: "User's not authenticated"}

        await connectDB();

        const membership = await HouseholdMember.find({userId, householdId});
        if(!membership) return {success: false, error: "User is not a member of this household"};

        const item = await MaintenanceItem.create({name, householdId, description, addedBy: userId});

        const populatedItem = await item.populate('addedBy', 'name avatar');

        const plainItem = JSON.parse(JSON.stringify(populatedItem));
        return {success: true, item: plainItem}
    } catch(e) {
        console.error(e);
        return {success: false, error: "Error creating shopping item"}
    }
}

export const toggleItemStatus = async (itemId: string) : Promise<itemToggleResult> => {
    try{
        const userId = await getAuthUser();
        if(!userId) return {success: false, error: "User's not authenticated"};

        await connectDB();

        const item = await ShoppingItem.findById(itemId);
        if(!item) return {success: false, error: "Item not found"};

        const membership = await HouseholdMember.find({userId, householdId: item.householdId})
        if(!membership) return {success: false, error: "User is not a member of this household"};

        if(item.isCompleted == false) {
            item.isCompleted = true;
            item.completedAt = Date.now();
        }
        else {
            item.isCompleted =false;
            item.completedAt = undefined;
        }
        await item.save()
        return {success: true}
    } catch(e) {
        console.error(e);
        return{success: false, error: "Error fetching item and toggling status"}
    }
}