export default function Message({ message }) {
  function isMessageFromUser() {
    return message.from === "user";
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
        {message.msg}
      </div>
    </div>
  );
}
