"use client";

import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import { useEffect, useRef, useState } from "react";
import { getSocket } from "@/config/websocket/websocket";

export default function ChatWindow({
  trip,
  participants,
  user,
  messages,
}: {
  trip: any;
  participants: any;
  user: any;
  messages: any;
}) {
  const [messagesList, setMessagesList] = useState<any[]>(messages);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [input, setInput] = useState("");

  const typingTimeout = useRef<NodeJS.Timeout | null>(null);
  const socket = getSocket();

  console.log(user?.firstName);

  useEffect(() => {
    socket.connect();

    // send join room event
    socket.emit("join-room", { tripId: trip?.id });

    // listen new messages and set message
    socket.on("new-message", (message) => {
      setMessagesList((prev) => [...prev, message]);
    });

    // Listen typing users and set typing users
    socket.on("user-typing", (userName) => {
      setTypingUsers((prev) =>
        prev.includes(userName) ? prev : [...prev, userName],
      );
    });

    socket.on("user-stop-typing", (userName) => {
      setTypingUsers((prev) => prev.filter((user) => user !== userName));
    });

    return () => {
      socket.off("new-message");
      socket.emit("leave-room", { tripId: trip?.id });
      socket.disconnect();
    };
  }, [trip?.id]);

  // send message
  const sendMessage = () => {
    if (!input.trim()) return;

    socket.emit("send-message", {
      tripId: trip?.id,
      senderId: user?.id,
      content: input,
    });

    setInput("");
    socket.emit("stop-typing", { tripId: trip?.id });
  };

  const handleTyping = (value: string) => {
    setInput(value);
    socket.emit("typing", { tripId: trip?.id, userName: user?.firstName });

    if (typingTimeout.current) clearTimeout(typingTimeout.current);

    typingTimeout.current = setTimeout(() => {
      socket.emit("stop-typing", {
        tripId: trip?.id,
        userName: user?.firstName,
      });
    }, 1000);
  };

  return (
    <div className="flex flex-col flex-1 justify-between relative">
      <div className="sticky top-0 bg-white z-10 h-auto">
        <ChatHeader trip={trip} participants={participants} />
      </div>
      <div className="max-h-[67vh] overflow-y-auto">
        <MessageList messages={messagesList} typingUsers={typingUsers} />
      </div>
      <div className="sticky bottom-0 bg-white z-10 h-[8vh]">
        <MessageInput onTyping={handleTyping} onSend={sendMessage} />
      </div>
    </div>
  );
}
