import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Restaurant, RestaurantDocument } from './schemas/restaurant.schema';

@Injectable()
export class RestaurantsService {
    constructor(
        @InjectModel(Restaurant.name) private restaurantModel: Model<RestaurantDocument>,
    ) { }

    async create(createRestaurantDto: any): Promise<Restaurant> {
        const restaurant = new this.restaurantModel(createRestaurantDto);
        return restaurant.save();
    }

    async findAll(lat?: number, lon?: number): Promise<Restaurant[]> {
        if (lat && lon) {
            return this.restaurantModel.find({
                location: {
                    $near: {
                        $geometry: { type: 'Point', coordinates: [lon, lat] },
                        $maxDistance: 5000, // 5km radius
                    },
                },
            }).exec();
        }
        return this.restaurantModel.find().exec();
    }

    async findOne(id: string): Promise<Restaurant | null> {
        return this.restaurantModel.findById(id).exec();
    }
}
