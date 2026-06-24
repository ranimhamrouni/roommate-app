import {Schema, model, models, Document, Types} from 'mongoose';

export interface IShoppingItem extends Document {
    name: string,
    householdId: Types.ObjectId,
    type: string,
    quantity: string,
    addedBy: Types.ObjectId,
    isPurchased: boolean,
    purchasedBy?: Types.ObjectId
}

const ShoppingItemSchema = new Schema<IShoppingItem> (
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
        type: {
            type: String,
            required: true,
            enum: {
                values: ['staple', 'shared expense']
            }
        },
        quantity: {
            type: String,
            required: true
        },
        addedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        isPurchased: {
            type: Boolean,
            default: false,
        },
        purchasedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        }
    },
    {
        timestamps: true
    }
)

export default models.ShoppingItem || model<IShoppingItem>('ShoppingItem',ShoppingItemSchema);