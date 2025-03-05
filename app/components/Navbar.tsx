"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-gradient-to-r from-purple-800/70 to-blue-900/70 backdrop-blur-lg text-white py-4 px-6 fixed w-full top-0 z-50 opacity-100 border-b border-gray-500/40">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center flex-1">
          <Image 
            src="/assets/logo.png" 
            alt="ChainSwitch Logo"
            width={40} 
            height={40} 
            className="mr-2"
          />
          <span className="text-xl font-bold">ChainSwitch</span>
        </Link>
        <div className="hidden md:flex space-x-8 flex-grow justify-center">
          {[
            { name: "Home", path: "/" },
            { name: "Features", path: "/features" },
            { name: "Contact", path: "/contact" },
            { name: "About Us", path: "/aboutus" }
          ].map(({ name, path }) => {
            const isActive = pathname === path;

            return (
              <Link
                key={name}
                href={path}
                className={`relative pb-2 transition-colors duration-300 group ${
                  isActive ? "text-blue-400 font-semibold" : "text-white hover:text-blue-300"
                }`}
              >
                {name}
                <span
                  className={`absolute left-0 bottom-0 w-full h-[2px] bg-blue-400 transition-transform duration-300 transform ${
                    isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  }`}
                />
              </Link>
            );
          })}
        </div>

        <div className="flex items-center space-x-4 flex-1 justify-end">
          <Button variant="ghost" asChild className="text-white transition-colors duration-300 hover:text-blue-300">
            <Link href="/accessibility">Accessibility</Link>
          </Button>
        </div>

      </div>
    </nav>
  );
}
