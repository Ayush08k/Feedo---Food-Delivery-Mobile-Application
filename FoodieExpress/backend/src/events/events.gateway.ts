import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { UsersService } from '../users/users.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly usersService: UsersService) {}

  @SubscribeMessage('joinRoom')
  handleJoinRoom(@MessageBody() roomId: string, @ConnectedSocket() client: Socket) {
    client.join(roomId); // Room ID can be OrderID or UserID
    return { event: 'joined', roomId };
  }

  async sendNotification(userId: string, preferenceKey: string, event: string, payload: any) {
    const prefs = await this.usersService.getNotificationPreferences(userId);
    // If not set, default to true or depending on preferenceKey, assume true.
    if (prefs[preferenceKey] !== false) {
        this.server.to(userId).emit(event, payload);
    }
  }

  @SubscribeMessage('location_update')
  handleLocationUpdate(@MessageBody() data: { orderId: string, lat: number, lng: number }, @ConnectedSocket() client: Socket) {
    const { orderId, lat, lng } = data;
    // Broadcast location to all users in the order room (usually the customer)
    this.server.to(orderId).emit('driver_location', { orderId, lat, lng });
  }

  emitOrderStatusUpdate(orderId: string, status: string) {
    this.server.to(orderId).emit('order_status', { orderId, status });
  }
}
