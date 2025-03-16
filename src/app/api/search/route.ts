import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY; 

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('recent_searches')
      .select('address')
      .order('created_at', { ascending: false })
      .limit(10); // Fetch more than needed to handle duplicates

    if (error) throw error;
    
    // Filter to get only unique addresses while maintaining order
    const uniqueAddresses = [...new Set(data.map((item: any) => item.address))];
    
    // Return only the first 3 unique addresses
    return NextResponse.json(uniqueAddresses.slice(0, 3), { status: 200 });
  } catch (error) {
    console.error("Error fetching recent searches:", error);
    return NextResponse.json(
      { error: 'Failed to fetch recent searches' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    // Log to help debug
    console.log("Received search request");
    
    const { address } = await req.json();
    console.log("Address to search:", address);
    
    if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
      return NextResponse.json({ error: "Invalid Ethereum address" }, { status: 400 });
    }

    // Verify API key exists
    if (!ETHERSCAN_API_KEY) {
      console.error("ETHERSCAN_API_KEY is not configured");
      return NextResponse.json({ error: "API configuration error" }, { status: 500 });
    }

    // Get balance
    console.log("Fetching balance from Etherscan");
    const balanceRes = await fetch(
      `https://api.etherscan.io/api?module=account&action=balance&address=${address}&tag=latest&apikey=${ETHERSCAN_API_KEY}`
    );
    
    // Check if response is OK
    if (!balanceRes.ok) {
      console.error(`Etherscan balance API returned status: ${balanceRes.status}`);
      return NextResponse.json({ 
        error: `Etherscan API returned status ${balanceRes.status}` 
      }, { status: balanceRes.status });
    }
    
    const balanceData = await balanceRes.json();
    console.log("Balance data status:", balanceData.status);
    
    // Get transactions
    console.log("Fetching transactions from Etherscan");
    const txRes = await fetch(
      `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=desc&apikey=${ETHERSCAN_API_KEY}`
    );
    
    // Check if response is OK
    if (!txRes.ok) {
      console.error(`Etherscan transaction API returned status: ${txRes.status}`);
      return NextResponse.json({ 
        error: `Etherscan API returned status ${txRes.status}` 
      }, { status: txRes.status });
    }
    
    const txData = await txRes.json();
    console.log("Transaction data status:", txData.status);

    // Check for API-level errors in the response
    if (balanceData.status !== "1") {
      console.error("Etherscan balance API error:", balanceData.message || "Unknown error");
      return NextResponse.json({ 
        error: balanceData.message || "Error fetching balance from Etherscan" 
      }, { status: 400 });
    }
    
    if (txData.status !== "1") {
      console.error("Etherscan transaction API error:", txData.message || "Unknown error");
      return NextResponse.json({ 
        error: txData.message || "Error fetching transactions from Etherscan" 
      }, { status: 400 });
    }

    // Ensure result exists and is an array
    const transactions = Array.isArray(txData.result) ? txData.result : [];
    const incoming = transactions.filter((tx: any) => tx.to && tx.to.toLowerCase() === address.toLowerCase());
    const outgoing = transactions.filter((tx: any) => tx.from && tx.from.toLowerCase() === address.toLowerCase());

    // Store in Supabase
    try {
      console.log("Storing search in Supabase");
      const { error: supabaseError } = await supabase.from("recent_searches").insert([{ address }]);
      if (supabaseError) {
        console.error('Supabase insert error:', supabaseError);
        // Continue even if Supabase insert fails
      }
    } catch (supabaseError) {
      console.error('Error storing search:', supabaseError);
      // Continue even if Supabase insert fails
    }

    // Format the response
    const response = {
      balance: parseInt(balanceData.result) / 1e18,
      incomingCount: incoming.length,
      outgoingCount: outgoing.length,
      firstTransaction: transactions.length > 0 ? new Date(parseInt(transactions[transactions.length - 1].timeStamp) * 1000).toISOString() : 'N/A',
      lastTransaction: transactions.length > 0 ? new Date(parseInt(transactions[0].timeStamp) * 1000).toISOString() : 'N/A',
      transactions: transactions
    };
    
    console.log("Returning successful response");
    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    console.error("API error details:", error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : "Unknown error occurred" 
    }, { status: 500 });
  }
}