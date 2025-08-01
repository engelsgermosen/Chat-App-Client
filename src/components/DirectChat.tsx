import { useState, useEffect, useRef } from "react";
import { useSocket } from "@/hooks/useSocket";
import apiClient from "@/apiClient";

interface Message {
  _id?: string;
  from: string;
  to: string;
  text: string;
  createdAt: string;
}

interface DirectChatProps {
  currentUserId: string;
  otherUserId: string;
}

export default function DirectChat({
  currentUserId,
  otherUserId,
}: DirectChatProps) {
  const socketRef = useSocket();
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  // Sala determinista para ambos usuarios
  const room = [currentUserId, otherUserId].sort().join("_");

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    // Unirse a la sala
    socket.emit("joinRoom", { room });

    // Cargar historial de mensajes
    (async () => {
      try {
        const res = await apiClient.get(`/chat/${room}/history`);
        const { data } = res;
        if (data.success) {
          setMessages(data.data);
        }
      } catch (err) {
        console.error("Error cargando historial:", err);
      }
    })();

    // Escuchar nuevos mensajes
    const handleNew = (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    };
    socket.on("chatMessage", handleNew);

    return () => {
      socket.off("chatMessage", handleNew);
      socket.emit("leaveRoom", { room });
    };
  }, [room, socketRef]);

  // Enviar mensaje y añadirlo localmente
  const sendMessage = () => {
    if (!text.trim()) return;
    const msg: Omit<Message, "_id"> = {
      from: currentUserId,
      to: otherUserId,
      text: text.trim(),
      createdAt: new Date().toISOString(),
    };
    socketRef.current?.emit("chatMessage", { room, message: msg });
    // Añadir mensaje del propio usuario
    setMessages((prev) => [...prev, msg]);
    setText("");
  };

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex grow items-center">
      <div className="flex flex-col h-full bg-slate-950 min-h-96 max-h-[600px] w-full max-w-3xl mx-auto border rounded-lg overflow-hidden">
        <div className="bg-slate-200 p-4 font-semibold">Chat privado</div>
        <div className="flex-1 p-4 space-y-2 overflow-y-auto bg-white">
          {messages.map((m, i) => {
            const isMe = m.from === currentUserId;
            return (
              <div
                key={i}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs px-3 py-2 rounded-lg ${
                    isMe
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-900"
                  }`}
                >
                  {m.text}
                  <div className="text-xs text-right opacity-70 mt-1">
                    {new Date(m.createdAt).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>
        <div className="p-4 bg-gray-100 flex items-center gap-2">
          <input
            className="flex-1 px-3 py-2 border rounded"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Escribe un mensaje..."
          />
          <button
            onClick={sendMessage}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
}
