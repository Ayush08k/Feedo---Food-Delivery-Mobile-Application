import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('joinRoom')
  handleJoinRoom(@MessageBody() roomId: string, @ConnectedSocket() client: Socket) {
    client.join(roomId); // Room ID can be OrderID or UserID
    return { event: 'joined', roomId };
  }

  emitOrderStatusUpdate(orderId: string, status: string) {
    this.server.to(orderId).emit('order_status', { orderId, status });
  }
}
