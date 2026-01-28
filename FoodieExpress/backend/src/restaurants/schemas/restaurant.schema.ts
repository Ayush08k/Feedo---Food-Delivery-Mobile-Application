import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RestaurantDocument = Restaurant & Document;

@Schema({ timestamps: true })
export class Restaurant {
    @Prop({ required: true })
    name: string;

    @Prop()
    description: string;

    @Prop()
    address: string;

    @Prop({
        type: { type: String, enum: ['Point'], required: true },
        coordinates: { type: [Number], required: true },
    })
    location: { type: string; coordinates: number[] };

    @Prop({ default: 0 })
    rating: number;

    @Prop()
    imageUrl: string;

    @Prop({ required: true })
    ownerId: string; // Reference to User ID

    @Prop()
    ownerName?: string;

    @Prop()
    restaurantPhone?: string;

    @Prop()
    cuisineType?: string;

    @Prop()
    fssaiLicense?: string;

    @Prop()
    gstNumber?: string;

    @Prop()
    openingTime?: string;

    @Prop()
    closingTime?: string;

    @Prop({ default: true })
    isOpen?: boolean;

    @Prop()
    restaurantLogo?: string;

    @Prop()
    bankAccountNumber?: string;

    @Prop()
    ifscCode?: string;
}

export const RestaurantSchema = SchemaFactory.createForClass(Restaurant);
RestaurantSchema.index({ location: '2dsphere' });
