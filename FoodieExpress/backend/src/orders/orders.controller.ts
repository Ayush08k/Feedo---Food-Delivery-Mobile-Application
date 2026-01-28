import { Controller, Get, Post, Body, Param, Patch, Query, UseGuards, Request } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }

    @UseGuards(AuthGuard('jwt'))
    @Post()
    create(@Request() req: any, @Body() createOrderDto: any) {
        return this.ordersService.create({ ...createOrderDto, customerId: req.user.userId });
    }

    @UseGuards(AuthGuard('jwt'))
    @Get()
    findAll(@Request() req: any, @Query('restaurantId') restaurantId?: string) {
        if (req.user.role === 'VENDOR' || restaurantId) {
            // Ideally check ownership if VENDOR
            return this.ordersService.findAllByRestaurant(restaurantId || req.user.sub); // Assuming restaurantId in user or passed
        }
        return this.ordersService.findAllByCustomer(req.user.userId);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.ordersService.findOne(id);
    }

    @Patch(':id/status')
    updateStatus(@Param('id') id: string, @Body('status') status: string) {
        return this.ordersService.updateStatus(id, status);
    }
}
