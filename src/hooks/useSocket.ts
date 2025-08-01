// src/hooks/useSocket.ts
import { useEffect, useRef } from "react";
import { io, type Socket } from "socket.io-client";

export function useSocket() {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // 1) crea la conexión
    const socket = io(import.meta.env.VITE_SOCKET_URL!, {
      path: "/socket.io",
      autoConnect: true,
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("🔗 Conectado a WS con id:", socket.id);
    });
    socket.on("respuesta", (msg) => {
      console.log("Servidor dice:", msg);
    });

    socket.on("friendDeleted", () => {
      console.log("Llego el evento eliminar");
    });

    socket.on("disconnect", (reason) => {
      console.log(`Desconectado con id: ${socket.id}; rason: ${reason}`);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return socketRef;
}
