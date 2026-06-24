'use server'

import { getAuthUser } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import HouseholdMember from '@/models/HouseholdMember';
import CalendarEvent, { ICalendarEvent } from '@/models/CalendarEvent';

export type PopulatedEvent =
    Omit<ICalendarEvent, 'createdBy'> & {
        createdBy: {
            _id: string;
            name: string;
            avatar?: string;
        }
    }

type eventsResult =
    | { success: false; error: string }
    | { success: true; events: PopulatedEvent[] }

type creationResult =
    | { success: false; error: string }
    | { success: true; event: ICalendarEvent }

export const getEvents = async (
    householdId: string
): Promise<eventsResult> => {
    try {
        const userId = await getAuthUser();

        if (!userId)
            return {
                success: false,
                error: 'User not authenticated'
            };

        await connectDB();

        const membership =
            await HouseholdMember.findOne({
                userId,
                householdId
            });

        if (!membership)
            return {
                success: false,
                error: 'User is not a member'
            };

        const events =
            await CalendarEvent.find({ householdId })
                .populate('createdBy', 'name avatar')
                .sort({ date: 1 })
                .lean();

        return {
            success: true,
            events: JSON.parse(JSON.stringify(events))
        };

    } catch (e) {
        console.error(e);

        return {
            success: false,
            error: 'Error fetching events'
        };
    }
};

export const createEvent = async (
    householdId: string,
    title: string,
    description: string,
    date: Date,
    time: string
): Promise<creationResult> => {

    try {
        const userId = await getAuthUser();

        if (!userId)
            return {
                success: false,
                error: 'User not authenticated'
            };

        await connectDB();

        const membership =
            await HouseholdMember.findOne({
                userId,
                householdId
            });

        if (!membership)
            return {
                success: false,
                error: 'User is not a member'
            };

        const event =
            await CalendarEvent.create({
                householdId,
                title,
                description,
                date,
                time,
                createdBy: userId
            });

        const populated =
            await event.populate(
                'createdBy',
                'name avatar'
            );

        return {
            success: true,
            event: JSON.parse(
                JSON.stringify(populated)
            )
        };

    } catch (e) {
        console.error(e);

        return {
            success: false,
            error: 'Error creating event'
        };
    }
};

export const getNumberEvents = async (
  householdId: string
): Promise<
  | { success: false; error: string }
  | { success: true; number: number }
> => {
  try {
    const userId = await getAuthUser();

    if (!userId) {
      return {
        success: false,
        error: "User not authenticated",
      };
    }

    await connectDB();

    const membership = await HouseholdMember.findOne({
      userId,
      householdId,
    });

    if (!membership) {
      return {
        success: false,
        error: "User is not a member",
      };
    }

    const number = await CalendarEvent.countDocuments({
      householdId,
    });

    return {
      success: true,
      number,
    };
  } catch (e) {
    console.error(e);

    return {
      success: false,
      error: "Error fetching events count",
    };
  }
};