import {Schema, model, models, Document, Types} from 'mongoose';

export interface IMaintenanceItem extends Document {
    name: string,
    householdId: Types.ObjectId,
    description?: string,
    addedBy: Types.ObjectId,
    isCompleted: boolean,
    completedAt?: Date,
}

const MaintenanceItemSchema = new Schema<IMaintenanceItem> (
    {
        name: {
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
        addedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        isCompleted: {
            type: Boolean,
            default: false,
        },
        completedAt: {
            type: Date,
        }
    },
    {
        timestamps: true
    }
)

export default models.MaintenanceItem || model<IMaintenanceItem>('MaintenanceItem',MaintenanceItemSchema);