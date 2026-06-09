import {Schema, model, models, Document, Types} from 'mongoose';

export interface IChore extends Document {
    householdId: Types.ObjectId,
    title: string,
    description?: string,
    assignedTo: Types.ObjectId,
    createdBy: Types.ObjectId,
    frequency: string,
    status: string,
    completedAt?: Date,
}

const ChoreSchema = new Schema<IChore> (
    {
        householdId: {
            type: Schema.Types.ObjectId,
            ref: 'Household',
            required: true
        },
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        assignedTo: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        frequency: {
            type: String,
            required: true,
            enum: {
                values: ['Once','Daily','Weekly','Every other week','Monthly'], 
            }
        },
        status: {
            type: String,
            required: true,
            default: 'Pending',
            enum: {
                values: ['Pending', 'Done']
            }
        },
        completedAt: {
            type: Date,
        }
    },
    {
        timestamps: true
    }
)

export default models.Chore || model<IChore>('Chore',ChoreSchema);