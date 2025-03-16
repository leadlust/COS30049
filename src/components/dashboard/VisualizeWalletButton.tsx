import { ChartPie, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface VisualizeWalletButtonProps {
  walletAddress: string;
  className?: string;
}


const VisualizeWalletButton = ({ walletAddress, className = "" }: VisualizeWalletButtonProps) => {
  if (!walletAddress) return null;

  //returns a button that links to the visualizer with the wallet address
  return (
    <Link href={`/visualizer?address=${walletAddress}`} passHref>
      <Button 
        className={`bg-purple-600 hover:bg-purple-700 transition-colors ${className}`}
      >
        <div className="flex items-center gap-2">
          <ChartPie className="w-4 h-4" />
          <span>Visualize Wallet</span>
          <ExternalLink className="w-3 h-3 opacity-70" />
        </div>
      </Button>
    </Link>
  );
};

export default VisualizeWalletButton;