import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('reviews')
export class ReviewsController {
    constructor(private readonly reviewsService: ReviewsService) { }

    @UseGuards(AuthGuard('jwt'))
    @Post()
    create(@Request() req: any, @Body() createReviewDto: any) {
        return this.reviewsService.create({ ...createReviewDto, userId: req.user.userId });
    }

    @Get('restaurant/:id')
    findByRestaurant(@Param('id') restaurantId: string) {
        return this.reviewsService.findByRestaurant(restaurantId);
    }
}
