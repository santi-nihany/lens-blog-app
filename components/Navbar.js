import { ConnectButton } from "@web3uikit/web3";

export default function Navbar() {
  return (
    <nav>
      <ul>
        <li>Home</li>
        <li>Write blog</li>
        <li>
          <div>
            <ConnectButton moralisAuth={false} />
            Hello from navbar!
          </div>
        </li>
      </ul>
    </nav>
  );
}
