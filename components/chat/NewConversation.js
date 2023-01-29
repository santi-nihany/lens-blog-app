import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import { useXMTPContext } from "@/context/XMTPContext";
import { ethers } from "ethers";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";

export default function NewConversation() {
  // const [message, setMessage] = useState("");
  const [receiverAddress, setReceiverAddress] = useState("");
  const [conversationName, setConversationName] = useState("");

  const { account } = useMoralis();
  const { client } = useXMTPContext();

  const {
    handleSubmit,
    reset,
    formState,
    formState: { isSubmitSuccessful },
  } = useForm();

  useEffect(() => {
    if (formState.isSubmitSuccessful) {
      reset();
    }
  }, [formState, reset, isSubmitSuccessful]);

  async function createConversation() {
    if (!receiverAddress) return toast.error("Please fill `address` field");
    if (!ethers.utils.isAddress(receiverAddress))
      return toast.error("Invalid address");

    console.log("receiverAddress", receiverAddress);
    console.log(`account : ${account}`);
    const conversation = await client.conversations.newConversation(
      receiverAddress,
      {
        conversationId: `${account}-${receiverAddress}/${conversationName}`,
        metadata: {
          title: conversationName,
        },
      }
    );

    toast.success("Conversation created!!");

    // await conversation.send(message);
    console.log("conversation", conversation);
  }

  return (
    <div>
      <h1 className="ml-5 mb-3 font-bold ">Create Conversation</h1>
      <div className="flex ml-2">
        <form onSubmit={handleSubmit(createConversation)}>
          <input
            className="italic ml-2 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            onChange={(e) => setReceiverAddress(e.target.value)}
            placeholder="Address"
          />

          <input
            className="italic ml-2 mr-2 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            onChange={(e) => setConversationName(e.target.value)}
            placeholder="Conversation Name"
          />
          <button
            className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
            type="submit"
          >
            Create
          </button>
        </form>
      </div>
    </div>
  );
}
