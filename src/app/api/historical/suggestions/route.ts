import { NextRequest } from 'next/server';
import { Neo4jService } from '@/services/neo4j';
import { createSuccessResponse, createErrorResponse } from '@/lib/utils/api';

export async function GET(request: NextRequest) {
  try {
    const searchTerm = request.nextUrl.searchParams.get('search');
    
    if (!searchTerm) {
      return createErrorResponse('Search term is required', 400);
    }

    const neo4jService = new Neo4jService();
    const suggestions = await neo4jService.searchAddresses(searchTerm);
    return createSuccessResponse(suggestions);

  } catch (error) {
    console.error('Error fetching address suggestions:', error);
    return createErrorResponse(
      error instanceof Error ? error.message : 'Failed to fetch suggestions',
      500
    );
  }
} 