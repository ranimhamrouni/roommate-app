import {Schema, model, models, Document, Types} from 'mongoose';

export interface ICalendarEvent extends Document {
    title: string,
    householdId: Types.ObjectId,
    description?: string,
    createdBy: Types.ObjectId,
    date: Date,
    time: string,
}

const CalendarEventSchema = new Schema<ICalendarEvent> (
    {
        title: {
            type: String,
            required: true
        },
        householdId: {
            type: Schema.Types.ObjectId,
            ref: 'Household',
            required: true,
        },
        description: {
            type: String,
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        date: {
            type: Date,
            default: Date.now,
            required: true
        },
        time: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
)

export default models.CalendarEvent || model<ICalendarEvent>('CalendarEvent',CalendarEventSchema);