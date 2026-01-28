import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum OrderStatus {
    PENDING = 'PENDING',
    CONFIRMED = 'CONFIRMED',
    PREPARING = 'PREPARING',
    READY = 'READY',
    PICKED_UP = 'PICKED_UP',
    DELIVERED = 'DELIVERED',
    CANCELLED = 'CANCELLED',
}

export type OrderDocument = Order & Document;

@Schema({ timestamps: true })
export class Order {
    @Prop({ required: true })
    customerId: string;

    @Prop({ required: true })
    restaurantId: string;

    @Prop()
    driverId: string;

    @Prop({
        type: [
            {
                itemId: { type: String, required: true },
                name: { type: String, required: true },
                quantity: { type: Number, required: true },
                price: { type: Number, required: true },
                options: [String],
            },
        ],
    })
    items: Record<string, any>[];

    @Prop({ required: true })
    totalAmount: number;

    @Prop({ required: true, enum: OrderStatus, default: OrderStatus.PENDING })
    status: OrderStatus;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
