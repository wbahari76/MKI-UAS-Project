"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "./AuthContext";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { user, profile } = useAuth();

  useEffect(() => {
    // Initialize socket connection to the custom Next.js server
    const socketInstance = io(window.location.origin, {
      path: "/socket.io/",
      addTrailingSlash: false,
    });

    socketInstance.on("connect", () => {
      console.log("Connected to Socket.IO server");
      setIsConnected(true);
      
      // Join a personal room if user is logged in
      if (user?.id) {
        socketInstance.emit("join-room", `user_${user.id}`);
      }
    });

    socketInstance.on("disconnect", () => {
      console.log("Disconnected from Socket.IO server");
      setIsConnected(false);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
