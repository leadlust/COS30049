// API Response Types
export type ApiSuccessResponse<T> = {
  status: 'success';
  data: T;
};

export type ApiErrorResponse = {
  status: 'error';
  error: string;
};

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

// Type guard
export function isApiError(response: ApiResponse<any>): response is ApiErrorResponse {
  return response.status === 'error';
}

// Etherscan Types
export interface EtherscanTransaction {
    timeStamp: string;
    hash: string;
    nonce: string;
    transactionIndex: string;
    from: string;
    to: string;
    value: string;
    gas: string;
    gasPrice: string;
    input: string;
    methodId: string;
    functionName: string;
    contractAddress: string;
    cumulativeGasUsed: string;
    txreceipt_status: string;
    gasUsed: string;
    confirmations: string;
    isError: string;
}

export type EtherscanBalance = string;

// Wallet Types
export interface WalletBalance {
    address: string;
    ensName?: string;
    balance: {
      eth: string;
      usd?: number;
    };
    lastActive?: string;
}

// Transaction Types
export type TransactionType = 'incoming' | 'outgoing';

export interface TransactionTableData {
  type: TransactionType;
  hash: string;
  amount: string;
  from: string;
  to: string;
  timestamp: string;
  status: 'success' | 'failed';
  gasUsed: string;
}