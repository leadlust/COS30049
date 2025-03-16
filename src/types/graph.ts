

export interface Node {
    id: string;
    val: number;
    isCenter?: boolean;
    x?: number;
    y?: number;
    totalTransactions?: number;
    totalReceived?: number;
    totalSent?: number;
  }
  export interface ForceGraphNode extends Node {
    x: number;
    y: number;
    index?: number;
    vx?: number;
    vy?: number;
    __indexColor?: string;
    __bckgDimensions?: number[];
  }

  
  export interface Link {
    id: string;
    source: string | Node;
    target: string | Node;
    val: number;
    hash: string;
    timestamp: string;
    gasPrice?: string;
    gasUsed?: string;
    methodId?: string;
    functionName?: string;
  }
  
  export interface ForceGraphLink extends Link {
    curvature: number;
  }
  export interface GraphData {
    nodes: ForceGraphNode[];
    links: ForceGraphLink[];
    metadata?: {
      dataSource: 'neo4j-cache' | 'etherscan';
      totalTransactions: number;
      uniqueAddresses: number;
      centerAddress: string;
      totalValue: number;
    };
  }
  