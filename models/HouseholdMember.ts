import {Schema, model, models, Document, Types} from 'mongoose';

export interface IHouseholdMember extends Document {
    householdId: Types.ObjectId,
    userId: Types.ObjectId,
    joinedAt: Date,
}

const HouseholdMemberSchema = new Schema<IHouseholdMember> (
    {
        householdId: {
            type: Schema.Types.ObjectId,
            ref: 'Household',
            required: true
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        joinedAt: {
            type: Date,
            required: true,
            default: Date.now
        }
    }
)

export default models.HouseholdMember || model<IHouseholdMember>('HouseholdMember',HouseholdMemberSchema);