import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { OffersService } from './offers.service';
import { Offer } from './schemas/offer.schema';
import { Item } from '../menu/schemas/item.schema';

@Controller('offers')
export class OffersController {
    constructor(private readonly offersService: OffersService) { }

    @Get()
    async findAll(): Promise<Offer[]> {
        return this.offersService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Offer | null> {
        return this.offersService.findOne(id);
    }

    @Get(':id/items')
    async getApplicableItems(@Param('id') id: string): Promise<Item[]> {
        return this.offersService.getApplicableItems(id);
    }

    @Post()
    async create(@Body() offerData: Partial<Offer>): Promise<Offer> {
        return this.offersService.create(offerData);
    }
}
