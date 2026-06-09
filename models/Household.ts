import {Schema, models , model, Document, Types} from 'mongoose';

export interface IHousehold extends Document {
    name: string;
    inviteCode: string;
    createdBy: Types.ObjectId;
}

const HouseholdSchema = new Schema<IHousehold> (
    {
        name: {
            type: String,
            required: true,
        },
        inviteCode: {
            type: String,
            required: true,
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        }
    },
    {
        timestamps: true
    }
)

export default models.Household || model<IHousehold>('Household', HouseholdSchema);