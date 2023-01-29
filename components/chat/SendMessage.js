import { useXMTPContext } from "@/context/XMTPContext";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

export default function SendMessage() {
  const [message, setMessage] = useState("");
  const { conversation } = useXMTPContext();
  const {
    handleSubmit,
    reset,
    formState,
    formState: { isSubmitSuccessful },
  } = useForm();

  // useEffect(() => {
  //   if (formState.isSubmitSuccessful) {
  //     reset();
  //   }
  // }, [formState, reset, isSubmitSuccessful]);

  async function sendMessage() {
    if (!message) return toast.error("Please fill `message` field");

    await conversation.send(message);
    toast.success("Message sent!!");
    setMessage("");
  }

  return (
    <div style={sendButton}>
      <form onSubmit={handleSubmit(sendMessage)}>
        <input
          className="italic ml-2 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="Type a message..."
          onChange={(e) => setMessage(e.target.value)}
          style={{ width: "82%" }}
        ></input>
        <button
          type="submit"
          className=" inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
          style={{ width: "15%" }}
        >
          Send
        </button>
      </form>
    </div>
  );
}

const sendButton = {
  gridRowStart: "8",
  width: "100%",
};
