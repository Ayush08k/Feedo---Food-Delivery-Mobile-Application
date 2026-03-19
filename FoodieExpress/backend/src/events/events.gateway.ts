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

  emitOrderStatusUpdate(orderId: string, status: string) {
    this.server.to(orderId).emit('order_status', { orderId, status });
  }
}
