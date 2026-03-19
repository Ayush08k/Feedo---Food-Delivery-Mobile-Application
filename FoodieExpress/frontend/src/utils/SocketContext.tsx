import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { useUser } from './UserContext';
import { useAlert } from './AlertContext';

const SOCKET_URL = 'http://192.168.1.4:3000';

interface SocketContextType {
    socket: Socket | null;
}

const SocketContext = createContext<SocketContextType>({ socket: null });

export const SocketProvider = ({ children }: { children: ReactNode }) => {
    const { profile } = useUser();
    const { showAlert } = useAlert();
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        const newSocket = io(SOCKET_URL);
        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, []);

    useEffect(() => {
        if (socket && profile?.email) {
            // Join a room uniquely identifying this user (e.g., their email)
            socket.emit('joinRoom', profile.email);

            // Listen for generic notifications
            socket.on('notification', (data: { title: string; message: string }) => {
                showAlert(data.title, data.message);
            });

            // Specific real-time updates examples
            socket.on('new_order', (data) => {
                showAlert('New Order Received! 🔔', `Order #${data.orderId || 'Incoming'} needs attention.`);
            });

            socket.on('order_status', (data) => {
                showAlert('Order Update 📦', `Your order status changed to: ${data.status}`);
            });

            socket.on('delivery_request', (data) => {
                showAlert('Delivery Request! 🛵', `New delivery job available nearby.`);
            });
        }

        return () => {
            if (socket) {
                socket.off('notification');
                socket.off('new_order');
                socket.off('order_status');
                socket.off('delivery_request');
            }
        };
    }, [socket, profile, showAlert]);

    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => useContext(SocketContext);
