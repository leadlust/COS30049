import { NextResponse } from 'next/server';
import { z } from 'zod';
import { fetchEtherscanWalletBalance, transformToWalletBalance } from '@/services/etherscan';

const addressSchema = z.string().regex(/^0x[a-fA-F0-9]{40}$/);

const {ETHERSCAN_API_KEY} = process.env;

export async function GET(
    request: Request,
    {params}: {params: Promise<{address: string}>}
) {
    try {
        const { address } = await params;
        const validatedAddress = addressSchema.parse(address.toLowerCase());

    if (!ETHERSCAN_API_KEY) {
        return NextResponse.json({error: 'Etherscan API key not configured'}, {status: 500});
    }
    const etherscanData = await fetchEtherscanWalletBalance(validatedAddress,ETHERSCAN_API_KEY);
    console.log(etherscanData);
    const balanceData = transformToWalletBalance(validatedAddress,etherscanData);
    console.log(balanceData);
    return NextResponse.json(balanceData);
    } catch (error) {
        console.error('Error fetching wallet balance:', error);
        return NextResponse.json(
            { 
              error: error instanceof Error ? error.message : 'Failed to fetch wallet balance' 
            },
            { status: 500 }
          );
    }
}