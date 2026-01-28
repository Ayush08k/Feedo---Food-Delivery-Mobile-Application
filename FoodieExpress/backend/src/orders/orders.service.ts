import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from './schemas/order.schema';
import { EventsGateway } from '../events/events.gateway';

@Injectable()
export class OrdersService {
    constructor(
        @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
        private eventsGateway: EventsGateway,
    ) { }

    async create(createOrderDto: any): Promise<Order> {
        const order = new this.orderModel(createOrderDto);
        return order.save();
    }

    async findAllByCustomer(customerId: string): Promise<Order[]> {
        return this.orderModel.find({ customerId }).sort({ createdAt: -1 }).exec();
    }

    async findAllByRestaurant(restaurantId: string): Promise<Order[]> {
        return this.orderModel.find({ restaurantId }).sort({ createdAt: -1 }).exec();
    }

    async findOne(id: string): Promise<Order | null> {
        return this.orderModel.findById(id).exec();
    }

    async updateStatus(id: string, status: string): Promise<Order | null> {
        const order = await this.orderModel.findByIdAndUpdate(id, { status }, { new: true }).exec();
        if (order) {
            this.eventsGateway.emitOrderStatusUpdate(id, status);
        }
        return order;
    }
}
