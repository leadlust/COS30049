import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface VisualizerSearchBarProps {
  className?: string;
}

const VisualizerSearchBar = ({ className = "" }: VisualizerSearchBarProps) => {
  const [address, setAddress] = useState<string>("");
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const isValidAddress = (address: string): boolean => {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  };

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isValidAddress(address)) {
      setError("Please enter a valid Ethereum address");
      return;
    }

    setIsValidating(true);
    
    try {
      // Store the address in localStorage for the Launch App button
      localStorage.setItem('lastSearchedAddress', address);
      
      // Navigate to the visualizer with the address
      router.push(`/visualizer?address=${address}`);
    } catch (err: any) {
      setError(err.message || "Failed to navigate");
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className={`max-w-xl mx-auto ${className}`}>
      {error && (
        <div className="mb-2 p-2 bg-red-900/50 text-red-300 text-sm rounded-md">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Enter wallet address (0x...)"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="pl-10 bg-black/20 border-gray-700 text-white placeholder:text-gray-400 h-12 w-full"
          />
        </div>
        <Button
          type="submit"
          className="bg-purple-600 hover:bg-purple-700 h-12 px-4 sm:px-6"
          disabled={isValidating}
        >
          {isValidating ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
              Searching
            </div>
          ) : (
            "Visualize"
          )}
        </Button>
      </form>
    </div>
  );
};

export default VisualizerSearchBar;