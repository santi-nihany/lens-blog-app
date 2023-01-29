import { useMoralis } from "react-moralis";

export default function Message({ message }) {
  const { account } = useMoralis();

  function isMessageFromUser() {
    return message.senderAddress.toLowerCase() == account;
  }
  return (
    <div
      className={`${
        isMessageFromUser() ? "place-self-end" : "place-self-start"
      } `}
    >
      <div
        style={{ backgroundColor: "#e8bfed" }}
        className={`m-1 p-2 rounded-2xl`}
      >
        {message.content}
      </div>
    </div>
  );
}
