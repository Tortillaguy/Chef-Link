import { Link } from "react-router-dom";
import { SignInButton } from "./sign-in-button";

export function Header() {
  return (
    <header className="flex w-full items-center justify-between p-4 bg-black/40 bg shadow-md absolute z-10">
      <Link to="/" className="flex items-center space-x-2">
        <span className="text-xl font-bold">ChefList</span>
      </Link>
      <nav>
        <SignInButton />
      </nav>
    </header>
  );
}
