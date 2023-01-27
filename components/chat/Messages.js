import Message from "./Message";

export default function Messages() {
  const messages = [
    { msg: "hi", from: "user" },
    { msg: "hi!!!", from: "user2" },
    { msg: "how r u?", from: "user2" },
  ];

  return (
    <ul className=" grid grid-cols-1">
      {messages && messages.map((message) => <Message message={message} />)}
    </ul>
  );
}
