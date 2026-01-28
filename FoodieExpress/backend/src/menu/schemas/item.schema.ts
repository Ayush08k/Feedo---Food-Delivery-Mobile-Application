import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ItemDocument = Item & Document;

@Schema({ timestamps: true })
export class Item {
    @Prop({ required: true })
    name: string;

    @Prop()
    description: string;

    @Prop({ required: true })
    price: number;

    @Prop()
    imageUrl: string;

    @Prop({ required: true })
    categoryId: string;

    @Prop({ required: true })
    restaurantId: string;

    @Prop({ default: true })
    isAvailable: boolean;
}

export const ItemSchema = SchemaFactory.createForClass(Item);
