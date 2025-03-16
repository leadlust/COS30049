// Base types for Neo4j entities
export interface NodeData {
    addressId: string;
    type: 'eoa' | 'contract';
  }
  
  export interface RelationshipData {
    from_address: string;
    to_address: string;
    hash: string;
    value: string;
    input: string;
    transaction_index: number;
    gas: number;
    gas_used: number;
    gas_price: number;
    transaction_fee: number;
    block_number: number;
    block_hash: string;
    block_timestamp: number;
  }
  
  // Types for API responses
  export interface TransactionData {
    hash: string;
    value: string;
    from_address: string;
    to_address: string;
    gas: number;
    gas_used: number;
    gas_price: number;
    transaction_fee: number;
    block_number: number;
    block_timestamp: number;
    input: string;
  }
  
  export interface AddressData {
    address: string;
    type: string;
  }
  
  export interface AddressHistoricalData {
    address: AddressData;
    incomingTransactions: TransactionData[];
    outgoingTransactions: TransactionData[];
    totalIncoming: string;
    totalOutgoing: string;
    totalTransactions: number;
  }
  
  // API Response types
  export interface ApiResponse<T> {
    data?: T;
    error?: string;
    status: 'success' | 'error';
}