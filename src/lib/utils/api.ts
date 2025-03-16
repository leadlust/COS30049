import { ApiSuccessResponse, ApiErrorResponse } from '@/types/api';
import { NextResponse } from 'next/server';

export function createSuccessResponse<T>(data: T): NextResponse<ApiSuccessResponse<T>> {
  return NextResponse.json({
    status: 'success',
    data
  });
}

export function createErrorResponse(
  message: string, 
  status: number = 400
): NextResponse<ApiErrorResponse> {
  return NextResponse.json({
    status: 'error',
    error: message
  }, { status });
}