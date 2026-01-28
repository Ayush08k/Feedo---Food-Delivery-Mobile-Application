import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review, ReviewDocument } from './schemas/review.schema';

@Injectable()
export class ReviewsService {
    constructor(@InjectModel(Review.name) private reviewModel: Model<ReviewDocument>) { }

    async create(createReviewDto: any): Promise<Review> {
        const review = new this.reviewModel(createReviewDto);
        return review.save();
    }

    async findByRestaurant(restaurantId: string): Promise<Review[]> {
        return this.reviewModel.find({ restaurantId }).exec();
    }
}
