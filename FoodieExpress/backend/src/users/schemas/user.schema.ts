import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum UserRole {
    CUSTOMER = 'CUSTOMER',
    VENDOR = 'VENDOR',
    DRIVER = 'DRIVER',
}

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    passwordHash: string;

    @Prop({ required: true, enum: UserRole, default: UserRole.CUSTOMER })
    role: UserRole;

    @Prop()
    phone?: string;

    @Prop([String])
    savedAddresses?: string[];

    @Prop()
    profileImage?: string;

    // Driver-specific fields
    @Prop()
    vehicleType?: string; // 'bike' | 'car'

    @Prop()
    vehicleNumber?: string;

    @Prop()
    licenseNumber?: string;

    @Prop()
    driverAddress?: string;

    @Prop()
    bankAccountNumber?: string;

    @Prop()
    ifscCode?: string;

    @Prop({ default: true })
    isAvailable?: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
