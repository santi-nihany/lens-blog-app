import { useXMTPContext } from "@/context/XMTPContext";
import { SortDirection } from "@xmtp/xmtp-js";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import Message from "./Message";

export default function Messages() {
  const { messages, setMessages, conversation } = useXMTPContext();

  async function getMessages() {
    const opts = {
      limit: 100,
      direction: SortDirection.SORT_DIRECTION_ASCENDING,
      // Only show messages from last 24 hours
      startTime: new Date(new Date().setDate(new Date().getDate() - 1)),
      endTime: new Date(),
    };
    try {
      const messages = await conversation.messages(opts);
      setMessages(messages);
    } catch (err) {
      console.log(`error fetching messages: ${err}`);
    }
  }
  useEffect(() => {
    if (conversation) {
      toast.promise(getMessages(), {
        loading: "Loading messages...",
        success: "Messages loaded!",
        error: "Error loading messages",
      });
    }
    listen();
  }, [conversation]);

  async function listen() {
    const stream = await conversation.streamMessages();
    for await (const newMessage of stream) {
      console.log("new message in real time! :", newMessage);
      getMessages();
      if (!conversation) break;
    }
  }

  return (
    <ul className=" grid grid-cols-1">
      {messages &&
        messages.map((message) => (
          <Message key={message.id} message={message} />
        ))}
    </ul>
  );
}
