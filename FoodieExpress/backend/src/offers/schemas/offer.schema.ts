import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OfferDocument = Offer & Document;

@Schema({ timestamps: true })
export class Offer {
    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    description: string;

    @Prop({ required: true })
    color: string;

    @Prop()
    discountPercentage: number;

    @Prop({ type: [String], default: [] })
    applicableItemIds: string[];

    @Prop()
    validFrom: Date;

    @Prop()
    validUntil: Date;

    @Prop({ default: true })
    isActive: boolean;

    @Prop()
    minOrderAmount: number;
}

export const OfferSchema = SchemaFactory.createForClass(Offer);
