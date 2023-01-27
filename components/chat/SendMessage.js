export default function SendMessages() {
  return (
    <div style={sendButton}>
      <form>
        <input
          className="italic ml-2 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="Type a message..."
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
