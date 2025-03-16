"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react"
import {Skeleton} from "@/components/ui/skeleton"

const Page = () => {
  const [address, setAddress] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [allAddresses, setAllAddresses] = useState<Array<{address: string; type: string}>>([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState<Array<{address: string; type: string}>>([]);
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Fetch all addresses from Neo4j when component mounts
  useEffect(() => {
    const fetchAllAddresses = async () => {
      try {
        const response = await fetch('/api/historical/all-addresses');
        if (!response.ok) throw new Error('Failed to fetch addresses');
        const data = await response.json();
        if (data.success && Array.isArray(data.data)) {
          setAllAddresses(data.data);
        } else {
          setAllAddresses([]);
        }
      } catch (error) {
        console.error('Error fetching addresses:', error);
        setAllAddresses([]);
      }
    };

    fetchAllAddresses();
  }, []);

  // Filter suggestions based on user input
  const handleSearch = (searchTerm: string) => {
    setAddress(searchTerm);
    
    if (!searchTerm || searchTerm.length < 2) {
      setFilteredSuggestions([]);
      return;
    }

    const filtered = allAddresses.filter(item => 
      item.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.type && item.type.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    setFilteredSuggestions(filtered.slice(0, 10)); // Limit to 10 suggestions
  };

  const isValidAddress = (address: string): boolean => {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isValidAddress(address)) {
      setError("Please enter a valid Ethereum address");
      return;
    }

    setIsValidating(true);
    
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("lastSearchedAddress", address);
      }
      router.push(`/historical/${address}`);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Failed to navigate");
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1625]">
      <div className="pt-20">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-3xl font-bold text-white mb-6">
            Historical Transaction Explorer
          </h1>
          
          <div className="mb-8">
            {error && (
              <div className="mb-4 p-3 bg-red-900/50 text-red-300 rounded-md">
                ⚠️ {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="flex gap-2">
              <div className="relative flex-1">
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="w-full justify-between bg-black/20 border-gray-700 text-white h-12"
                    >
                      {address
                        ? address
                        : "Select an address..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command shouldFilter={false}>
                      <CommandInput 
                        placeholder="Search address..."
                        onValueChange={handleSearch}
                      />
                      <CommandEmpty>No address found.</CommandEmpty>
                      <CommandGroup>
                        {filteredSuggestions.map((suggestion) => (
                          <CommandItem
                            key={suggestion.address}
                            onSelect={() => {
                              setAddress(suggestion.address);
                              setOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                address === suggestion.address ? "opacity-100" : "opacity-0"
                              )}
                            />
                            <div className="flex flex-col">
                              <span>{suggestion.address}</span>
                              <span className="text-sm text-gray-400">{suggestion.type}</span>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
              <Button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 h-12 px-6"
                disabled={isValidating}
              >
                {isValidating ? (
                  <div className="flex items-center justify-center">
                    <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                    Searching...
                  </div>
                ) : (
                  "Search"
                )}
              </Button>
            </form>
          </div>

          {/* Graph Skeleton */}
          <div className="mt-4 rounded-lg overflow-hidden bg-black min-h-[400px] h-[600px] max-h-[calc(100vh-200px)]">
            <div className="h-full w-full flex items-center justify-center">
              <div className="text-gray-500">Enter an address to view transaction graph</div>
            </div>
          </div>
          
          {/* Transaction Table Skeleton */}
          <div className="mt-4">
            <Card className="bg-gray-900/50 border-gray-800">
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-gray-400 text-sm">
                    <Skeleton className="h-4 w-24 bg-gray-800" />
                    <Skeleton className="h-4 w-24 bg-gray-800" />
                  </div>
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <Skeleton className="h-4 w-48 bg-gray-800" />
                      <Skeleton className="h-4 w-24 bg-gray-800" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Page; 