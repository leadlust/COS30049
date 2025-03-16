import { NextResponse } from "next/server";
// import { supabase } from "@/lib/supabaseClient";
import { z } from "zod";
import { fetchEtherscanTransactions, transformToGraphData,transformToTransactionTableData } from "@/services/etherscan";
//API Key and Neo4j Configuration
const { ETHERSCAN_API_KEY } = process.env;
// Validation schema
const addressSchema = z.string().regex(/^0x[a-fA-F0-9]{40}$/);
// Helper functions
function validateAddress(address: string): string {
  return addressSchema.parse(address.toLowerCase());
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ address: string }>}
) {
  try {
    // Await the params object
    const { address } = await params;
    const validatedAddress = validateAddress(address);
    
    // Make sure we pass both required parameters to fetchEtherscanTransactions
    if (!ETHERSCAN_API_KEY) {
      throw new Error("Etherscan API key not configured");
    }

    const transactions = await fetchEtherscanTransactions(
      validatedAddress,
      ETHERSCAN_API_KEY
    );
    // console.log(transactions.length);
    // console.log(transactions);


    // transformToGraphData only needs transactions and address
    const graphData = transformToGraphData(transactions, validatedAddress);
    const tableData = transformToTransactionTableData(transactions, validatedAddress);
    // console.log(graphData.links.length);
    return NextResponse.json({graphData,tableData});

  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error occurred"
      }, 
      { status: 500 }
    );
  }
}
