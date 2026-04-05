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
    // Scroll to the bottom whenever a new message arrives
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    // Initialize Pusher Client-side
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
    });

    // Subscribe to the specific job's chat channel
    const channelName = `chat-${jobId}`;
    const channel = pusher.subscribe(channelName);

    // Listen for the 'new-message' event we defined in our API route
    channel.bind("new-message", (newMsg) => {
      setMessages((prev) => [...prev, newMsg]);
    });

    // Cleanup when the user leaves the page
    return () => {
      pusher.unsubscribe(channelName);
    };
  }, [jobId]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const textToSend = inputText;
    setInputText(""); // Clear input immediately for better UX

    await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobId, text: textToSend }),
    });
  };

  return (
    <div className="flex flex-col h-[500px] w-full max-w-md mx-auto bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <div className="bg-indigo-600 p-4 text-white font-semibold">
        Job Coordination Chat
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((msg, idx) => {
          const isMe = msg.sender._id === session?.user?.id;
          return (
            <div key={idx} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[75%] rounded-lg p-3 ${isMe ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-800"}`}>
                {!isMe && <span className="block text-xs text-gray-500 font-semibold mb-1">{msg.sender.name}</span>}
                <p className="text-sm">{msg.text}</p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={sendMessage} className="p-3 bg-white border-t border-gray-200 flex gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 rounded-full border border-gray-300 px-4 py-2 focus:outline-none focus:border-indigo-500"
        />
        <button
          type="submit"
          className="bg-indigo-600 text-white rounded-full px-5 py-2 font-medium hover:bg-indigo-700 transition-colors"
        >
          Send
        </button>
      </form>
    </div>
  );
}