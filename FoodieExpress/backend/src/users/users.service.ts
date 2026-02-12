import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }

    async create(createUserDto: CreateUserDto): Promise<UserDocument> {
        const createdUser = new this.userModel(createUserDto);
        return createdUser.save();
    }

    async findOneByEmail(email: string): Promise<UserDocument | null> {
        return this.userModel.findOne({ email }).exec();
    }

    async findById(userId: string): Promise<UserDocument | null> {
        return this.userModel.findById(userId).select('-passwordHash').exec();
    }

    async updateProfile(userId: string, updateProfileDto: UpdateProfileDto): Promise<UserDocument | null> {
        return this.userModel
            .findByIdAndUpdate(userId, { $set: updateProfileDto }, { new: true })
            .select('-passwordHash')
            .exec();
    }
}
