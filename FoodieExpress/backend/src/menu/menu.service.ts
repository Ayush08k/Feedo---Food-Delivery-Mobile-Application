import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from './schemas/category.schema';
import { Item, ItemDocument } from './schemas/item.schema';

@Injectable()
export class MenuService {
    constructor(
        @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
        @InjectModel(Item.name) private itemModel: Model<ItemDocument>,
    ) { }

    async createCategory(createCategoryDto: any): Promise<Category> {
        const category = new this.categoryModel(createCategoryDto);
        return category.save();
    }

    async createItem(createItemDto: any): Promise<Item> {
        const item = new this.itemModel(createItemDto);
        return item.save();
    }

    async getMenuByRestaurant(restaurantId: string): Promise<any> {
        const categories = await this.categoryModel.find({ restaurantId }).exec();
        const items = await this.itemModel.find({ restaurantId }).exec();

        // Group items by category
        return categories.map((cat) => ({
            ...cat.toObject(),
            items: items.filter((item) => item.categoryId.toString() === cat['_id'].toString()),
        }));
    }
}
