import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { MenuService } from './menu.service';

@Controller('menu')
export class MenuController {
    constructor(private readonly menuService: MenuService) { }

    @Post('categories')
    createCategory(@Body() createCategoryDto: any) {
        return this.menuService.createCategory(createCategoryDto);
    }

    @Post('items')
    createItem(@Body() createItemDto: any) {
        return this.menuService.createItem(createItemDto);
    }

    @Get('restaurant/:id')
    getMenuByRestaurant(@Param('id') restaurantId: string) {
        return this.menuService.getMenuByRestaurant(restaurantId);
    }
}
