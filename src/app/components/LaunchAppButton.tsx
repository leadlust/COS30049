import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";

interface LaunchAppButtonProps {
  className?: string;
}

const LaunchAppButton = ({ className = "" }: LaunchAppButtonProps) => {
  //check localStorage for recently searched wallet addresses
  const [recentAddress, setRecentAddress] = useState<string | null>(null);
  
  useEffect(() => {
    //only run in the browser
    if (typeof window !== 'undefined') {
      //try to get the most recent search from localStorage
      const storedAddress = localStorage.getItem('lastSearchedAddress');
      if (storedAddress) {
        setRecentAddress(storedAddress);
      }
    }
  }, []);

  return (
    <Link 
      href={recentAddress ? `/visualizer?address=${recentAddress}` : '/visualizer'} 
      passHref
    >
      <Button className={`bg-purple-600 hover:bg-purple-700 ${className}`}>
        Launch App
      </Button>
    </Link>
  );
};

export default LaunchAppButton;