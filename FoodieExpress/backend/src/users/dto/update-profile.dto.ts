import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateProfileDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    phone?: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsString()
    profileImage?: string;

    // Customer fields
    @IsOptional()
    @IsString()
    address?: string;

    // Driver fields
    @IsOptional()
    @IsString()
    vehicleType?: string;

    @IsOptional()
    @IsString()
    vehicleNumber?: string;

    @IsOptional()
    @IsString()
    licenseNumber?: string;

    @IsOptional()
    @IsString()
    driverAddress?: string;

    @IsOptional()
    @IsString()
    bankAccountNumber?: string;

    @IsOptional()
    @IsString()
    ifscCode?: string;

    @IsOptional()
    @IsBoolean()
    isAvailable?: boolean;
}
