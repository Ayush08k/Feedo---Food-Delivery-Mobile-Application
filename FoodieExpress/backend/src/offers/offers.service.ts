import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Offer, OfferDocument } from './schemas/offer.schema';
import { Item, ItemDocument } from '../menu/schemas/item.schema';

@Injectable()
export class OffersService {
    constructor(
        @InjectModel(Offer.name) private offerModel: Model<OfferDocument>,
        @InjectModel(Item.name) private itemModel: Model<ItemDocument>,
    ) { }

    async findAll(): Promise<Offer[]> {
        return this.offerModel.find({ isActive: true }).exec();
    }

    async findOne(id: string): Promise<Offer | null> {
        return this.offerModel.findById(id).exec();
    }

    async getApplicableItems(offerId: string): Promise<Item[]> {
        const offer = await this.offerModel.findById(offerId).exec();
        if (!offer || !offer.applicableItemIds || offer.applicableItemIds.length === 0) {
            return [];
        }
        return this.itemModel.find({ _id: { $in: offer.applicableItemIds } }).exec();
    }

    async create(offerData: Partial<Offer>): Promise<Offer> {
        const newOffer = new this.offerModel(offerData);
        return newOffer.save();
    }
}
