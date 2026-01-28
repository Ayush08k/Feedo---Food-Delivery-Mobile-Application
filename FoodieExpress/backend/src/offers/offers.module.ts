import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OffersController } from './offers.controller';
import { OffersService } from './offers.service';
import { Offer, OfferSchema } from './schemas/offer.schema';
import { Item, ItemSchema } from '../menu/schemas/item.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Offer.name, schema: OfferSchema },
            { name: Item.name, schema: ItemSchema },
        ]),
    ],
    controllers: [OffersController],
    providers: [OffersService],
    exports: [OffersService],
})
export class OffersModule { }
