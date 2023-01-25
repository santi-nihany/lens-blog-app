import { ConnectButton } from "@web3uikit/web3";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="pt-5 pb-5 pr-10 pl-10 h-70 w-full bg-white fixed top-0 p-0 font-bold border-b-2 border-solid border-black z-99">
      <ul className="list-none m-0 p-0 flex items-center justify-between h-full">
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/write-blog">
            <div className="flex space-x-2 justify-center">
              <button
                type="button"
                className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
              >
                Write Blog
              </button>
            </div>
          </Link>
        </li>
        <li>
          <div>
            <ConnectButton moralisAuth={false} />
          </div>
        </li>
        <li>
          <Link href="/chat">
            <div className="flex space-x-2 justify-center">
              <button
                type="button"
                className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
              >
                chat
              </button>
            </div>
          </Link>
        </li>
      </ul>
    </nav>
  );
}
