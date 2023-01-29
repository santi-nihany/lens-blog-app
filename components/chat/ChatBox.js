import Messages from "./Messages";
import SendMessage from "./SendMessage";

export default function ChatBox({ conversation }) {
  return (
    <div style={chatBox}>
      <div
        className="grid"
        style={{ gridTemplateRows: `repeat(8, minmax(0, 46px))` }}
      >
        <h1 style={{ textAlign: "center" }}>
          {conversation.context.metadata.title
            ? `${conversation.context.metadata.title} with: `
            : "Chat with: "}
          {conversation.peerAddress}
        </h1>
        <Messages />
        <SendMessage />
      </div>
    </div>
  );
}

const chatBox = {
  width: "50%",
  borderRadius: "6px",
  margin: "1rem",
  height: "23rem",
  backgroundColor: "#eeefe3",
};
