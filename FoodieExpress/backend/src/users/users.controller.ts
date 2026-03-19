import { Controller, Get, Put, Body, Query } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get('preferences')
    async getPreferences(@Query('email') email: string) {
        if (!email) return {};
        const user = await this.usersService.findOneByEmail(email);
        return user ? this.usersService.getNotificationPreferences(user._id.toString()) : {};
    }

    @Put('preferences')
    async updatePreferences(@Body('email') email: string, @Body('preferences') preferences: Record<string, boolean>) {
        if (!email) return {};
        const user = await this.usersService.findOneByEmail(email);
        if (user) {
            return this.usersService.updateNotificationPreferences(user._id.toString(), preferences);
        }
        return {};
    }
}
