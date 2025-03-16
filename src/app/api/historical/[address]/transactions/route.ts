import { NextRequest } from 'next/server';
import { Neo4jService } from '@/services/neo4j';
import { createSuccessResponse, createErrorResponse } from '@/lib/utils/api';
import { AddressHistoricalData } from '@/types/neo4j';

export async function GET(
  request: NextRequest,
  { params }: { params: { address: string } }
) {
  try {
    const { address } = await params;

    // Validate address format
    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
      return createErrorResponse('Invalid Ethereum address format', 400);
    }

    const neo4jService = new Neo4jService();
    const historicalData = await neo4jService.getAddressHistoricalData(address);

    if (!historicalData) {
      return createErrorResponse('Address not found', 404);
    }

    return createSuccessResponse<AddressHistoricalData>(historicalData);

  } catch (error) {
    console.error('Error fetching historical data:', error);
    return createErrorResponse(
      error instanceof Error ? error.message : 'Failed to fetch historical data',
      500
    );
  }
}