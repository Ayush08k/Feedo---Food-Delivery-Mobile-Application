import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';

@Controller('restaurants')
export class RestaurantsController {
    constructor(private readonly restaurantsService: RestaurantsService) { }

    @Post()
    create(@Body() createRestaurantDto: any) {
        return this.restaurantsService.create(createRestaurantDto);
    }

    @Get()
    findAll(@Query('lat') lat?: string, @Query('lon') lon?: string) {
        const latitude = lat ? parseFloat(lat) : undefined;
        const longitude = lon ? parseFloat(lon) : undefined;
        return this.restaurantsService.findAll(latitude, longitude);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.restaurantsService.findOne(id);
    }
}
