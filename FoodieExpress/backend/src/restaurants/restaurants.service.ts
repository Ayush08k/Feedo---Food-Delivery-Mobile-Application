import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Restaurant, RestaurantDocument } from './schemas/restaurant.schema';

@Injectable()
export class RestaurantsService {
    constructor(
        @InjectModel(Restaurant.name) private restaurantModel: Model<RestaurantDocument>,
    ) { }

    async create(createRestaurantDto: any): Promise<RestaurantDocument> {
        const restaurant = new this.restaurantModel(createRestaurantDto);
        return restaurant.save();
    }

    async findAll(lat?: number, lon?: number, sortBy: string = 'rating'): Promise<RestaurantDocument[]> {
        let query = this.restaurantModel.find();

        if (lat && lon) {
            query = this.restaurantModel.find({
                location: {
                    $near: {
                        $geometry: { type: 'Point', coordinates: [lon, lat] },
                        $maxDistance: 5000, // 5km radius
                    },
                },
            });
        }

        // Add sorting - default is by rating descending
        if (sortBy === 'rating') {
            query = query.sort({ rating: -1 }); // -1 for descending order
        }

        return query.exec();
    }

    async findOne(id: string): Promise<RestaurantDocument | null> {
        return this.restaurantModel.findById(id).exec();
    }
}
