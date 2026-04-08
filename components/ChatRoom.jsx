"use client";

import { useState, useEffect, useRef } from "react";
import Pusher from "pusher-js";
import { useSession } from "next-auth/react";

export default function ChatRoom({ jobId, initialMessages = [] }) {
  const { data: session } = useSession();
  const [messages, setMessages] = useState(initialMessages);
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
    });

    const channelName = `chat-${jobId}`;
    const channel = pusher.subscribe(channelName);

    channel.bind("new-message", (newMsg) => {
      setMessages((prev) => [...prev, newMsg]);
    });

    return () => {
      pusher.unsubscribe(channelName);
    };
  }, [jobId]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const textToSend = inputText;
    setInputText(""); 

    await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobId, text: textToSend }),
    });
  };

  return (
    <div className="flex flex-col h-125 w-full max-w-md mx-auto bg-[#F1FAEE] border border-[#A8DADC]/50 rounded-xl shadow-sm overflow-hidden">
      <div className="bg-[#457B9D] p-4 text-white font-semibold">
        Job Coordination Chat
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F4F1DE]">
        {messages.map((msg, idx) => {
          const isMe = msg.sender._id === session?.user?.id;
          return (
            <div key={idx} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[75%] rounded-lg p-3 ${isMe ? "bg-[#457B9D] text-white" : "bg-[#A8DADC]/30 text-[#1D3557]"}`}>
                {!isMe && <span className="block text-xs text-[#3D405B] font-semibold mb-1">{msg.sender.name}</span>}
                <p className="text-sm">{msg.text}</p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} className="p-3 bg-[#F1FAEE] border-t border-[#A8DADC]/50 flex gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 rounded-full border border-[#A8DADC] bg-white px-4 py-2 focus:outline-none focus:border-[#457B9D]"
        />
        <button
          type="submit"
          className="bg-[#457B9D] text-white rounded-full px-5 py-2 font-medium hover:bg-[#1D3557] transition-colors"
        >
          Send
        </button>
      </form>
    </div>
  );
}