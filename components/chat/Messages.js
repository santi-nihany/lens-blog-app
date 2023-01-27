import Message from "./Message";

export default function Messages() {
  const messages = [
    { msg: "hi", from: "user", id: "1" },
    { msg: "hi!!!", from: "user2", id: "2" },
    { msg: "how r u?", from: "user2", id: "3" },
  ];

  return (
    <ul className=" grid grid-cols-1">
      {messages &&
        messages.map((message) => (
          <Message key={message.id} message={message} />
        ))}
    </ul>
  );
}
