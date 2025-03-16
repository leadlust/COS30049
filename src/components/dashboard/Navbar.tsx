"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetHeader, SheetTitle } from "@/components/ui/sheet";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/pricing", label: "Pricing"},
  { href: "/admin/upload", label: "Upload" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [lastSearchedAddress, setLastSearchedAddress] = useState<string | null>(null);
  
  //check for the last searched address in localStorage when the component mounts
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedAddress = localStorage.getItem("lastSearchedAddress");
      setLastSearchedAddress(storedAddress);
    }
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  //determine the visualizer URL
  const visualizerUrl = lastSearchedAddress 
    ? `/dashboard/${lastSearchedAddress}` 
    : "/dashboard";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-gray-900/60 flex items-center justify-between px-6 py-4">
      <Link href="/" className="text-xl font-semibold text-white">
        BlockViz
      </Link>
      <div className="hidden md:flex items-center justify-center flex-grow">
        <nav className="flex items-center gap-6">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="text-gray-300 hover:text-white">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="flex items-center gap-4">
        <Button asChild className="hidden md:inline-flex bg-[#a855f7] hover:bg-[#9333ea] text-white">
          <Link href={visualizerUrl}>Launch App</Link>
        </Button>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleMenu}>
              {isOpen ? <X className="h-6 w-6 text-white" /> : <Menu className="h-6 w-6 text-white" />}
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-gray-900">
            <SheetHeader>
              <SheetTitle className="text-white">Menu</SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-4 mt-6">
              {navItems.map((item) => (
                <SheetClose asChild key={item.href}>
                  <Link href={item.href} className="text-gray-300 hover:text-white text-lg" onClick={toggleMenu}>
                    {item.label}
                  </Link>
                </SheetClose>
              ))}
              <SheetClose asChild>
                <Button asChild className="bg-[#a855f7] hover:bg-[#9333ea] text-white mt-4" onClick={toggleMenu}>
                  <Link href={visualizerUrl}>Launch App</Link>
                </Button>
              </SheetClose>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}