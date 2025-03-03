"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-gradient-to-r from-purple-800/70 to-blue-900/70 backdrop-blur-lg text-white py-4 px-6 fixed w-full top-0 z-50 opacity-100 border-b 0.5px border-gray-500/40">
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
          {["Home", "Features", "Contact", "About Us"].map((item) => {
            const link = item.toLowerCase();
            const isActive = pathname === `/${link === "home" ? "" : link}`;
            return (
              <Link
                key={item}
                href={`/${link === "home" ? "" : link}`}
                className={`relative pb-2 transition ${
                  isActive ? "text-blue-400 font-semibold" : "hover:text-gray-300"
                }`}
              >
                {item}
                <span
                  className={`absolute left-0 bottom-0 w-full h-[2px] bg-blue-400 transition-transform ${
                    isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  }`}
                />
              </Link>
            );
          })}
        </div>
        <div className="flex items-center space-x-4 flex-1 justify-end">
          <Button variant="ghost" asChild className="text-white hover:text-gray-900">
            <Link href="/login">Login</Link>
          </Button>
          <Button
            variant="outline"
            asChild
            className="bg-transparent text-white hover:bg-white hover:text-gray-900"
          >
            <Link href="/signup">Sign Up</Link>
          </Button>
        </div>

      </div>
    </nav>
  );
}
