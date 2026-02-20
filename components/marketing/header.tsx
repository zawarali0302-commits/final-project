import { Button } from "@/components/ui/button";
import Link from "next/link";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur border-b">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="h-10 w-10 rounded-xl bg-linear-to-br from-black to-gray-800 text-white flex items-center justify-center font-bold tracking-tight">
            SR
          </div>
          <div className="leading-tight">
            <h1 className="text-lg font-semibold group-hover:opacity-90">
              Resultify
            </h1>
            <p className="text-xs text-gray-500">
              Academic Result Management
            </p>
          </div>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Link href={"/login"} >
            <Button variant={"ghost"}>
              Login
            </Button>
          </Link>
          <Link href={"/signup"}>
            <Button>
              Sign Up
            </Button>
          </Link>
          {/* <LoginButton />
          <SignUpButton /> */}
        </div>

      </div>
    </header>
  );
};

export default Header;
