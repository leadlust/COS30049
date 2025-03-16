import { EtherscanTransaction,TransactionTableData,TransactionType,EtherscanBalance,WalletBalance } from "@/types/api";
import { GraphData, Node, Link, ForceGraphNode } from "@/types/graph";

  const CONFIG = {
    MAX_TRANSACTIONS: 200,
    NODE_SIZES: {
      CENTER: 4,
      NORMAL: 2,
    },
    WEI_TO_ETH: 1e18,
    CURVATURE: 0.05 
  } as const;

  export async function fetchEtherscanWalletBalance(
    address: string,
    apiKey: string
  ): Promise<EtherscanBalance> {
    if (!apiKey) {
      throw new Error("Etherscan API key not configured");
    }
    const response = await fetch(`https://api.etherscan.io/api?module=account&action=balance&address=${address}&tag=latest&apikey=${apiKey}`);
    if (!response.ok) {
      throw new Error(`Etherscan API error: ${response.status}`);
    }
    const data = await response.json();
    if (data.status !== "1") {
      throw new Error(data.message || "Invalid response from Etherscan");
    }
    // const result = data.map((a: EtherscanBalance) => ({result: a.result,address:address}));
    return data.result;
  }
  
  export async function fetchEtherscanTransactions(
    address: string, 
    apiKey: string
  ): Promise<EtherscanTransaction[]> {
    if (!apiKey) {
      throw new Error("Etherscan API key not configured");
    }
  
    const response = await fetch(
      `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=desc&apikey=${apiKey}`
    );
  
    if (!response.ok) {
      throw new Error(`Etherscan API error: ${response.status}`);
    }
  
    const data = await response.json();
    // console.log("total transactions: ",data.result.length);
    if (data.status !== "1" || !Array.isArray(data.result)) {
      throw new Error(data.message || "Invalid response from Etherscan");
    }
  
    // return data.result.slice(0, CONFIG.MAX_TRANSACTIONS);
    return data.result;
  }
  
  export function transformToGraphData(
    transactions: EtherscanTransaction[], 
    centerAddress: string
  ): GraphData {
    // console.log('Input transactions:', transactions.length);
    const normalizedCenterAddress = centerAddress.toLowerCase();
    const nodes = new Map<string, Node>();
    const linksMap = new Map<string, Link>();
  
    // Add center node
    nodes.set(normalizedCenterAddress, {
      id: normalizedCenterAddress,
      val: CONFIG.NODE_SIZES.CENTER,
      isCenter: true,
      totalTransactions: 0,
      totalReceived: 0,
      totalSent: 0,
      x: 0,
      y: 0
    });
  
    // Process transactions
    transactions.forEach(tx => {
      const fromAddress = tx.from.toLowerCase();
      const toAddress = tx.to?.toLowerCase();
      const value = parseFloat(tx.value) / CONFIG.WEI_TO_ETH;
  
      // Skip only if toAddress is undefined
      if (!toAddress) return;
  
      // Add or update nodes
      if (!nodes.has(fromAddress)) {
        nodes.set(fromAddress, {
          id: fromAddress,
          val: CONFIG.NODE_SIZES.NORMAL,
          isCenter: false,
          totalTransactions: 0,
          totalReceived: 0,
          totalSent: 0,
          x: 0,
          y: 0
        });
      }
  
      if (!nodes.has(toAddress)) {
        nodes.set(toAddress, {
          id: toAddress,
          val: CONFIG.NODE_SIZES.NORMAL,
          isCenter: false,
          totalTransactions: 0,
          totalReceived: 0,
          totalSent: 0,
          x: 0,
          y: 0
        });
      }
  
      // Create link
      const link: Link = {
        id: tx.hash,
        source: fromAddress,
        target: toAddress,
        val: value,
        hash: tx.hash,
        timestamp: tx.timeStamp,
        gasPrice: tx.gasPrice,
        gasUsed: tx.gasUsed,
        methodId: tx.methodId,
        functionName: tx.functionName
      };
  
      linksMap.set(tx.hash, link);
  
      // Update node statistics
      const fromNode = nodes.get(fromAddress)!;
      const toNode = nodes.get(toAddress)!;
  
      fromNode.totalTransactions = (fromNode.totalTransactions || 0) + 1;
      fromNode.totalSent = (fromNode.totalSent || 0) + value;
  
      toNode.totalTransactions = (toNode.totalTransactions || 0) + 1;
      toNode.totalReceived = (toNode.totalReceived || 0) + value;
    });
  
    const nodeArray = Array.from(nodes.values());
    const linkArray = Array.from(linksMap.values()).map((link, index, array) => ({
      ...link,
      curvature: (index - array.length/2) * CONFIG.CURVATURE
    }));;
  
    // console.log('Transformation results:', {
    //   inputTransactions: transactions.length,
    //   outputNodes: nodeArray.length,
    //   outputLinks: linkArray.length
    // });
  
    return {
      nodes: nodeArray as ForceGraphNode[],
      links: linkArray,
      metadata: {
        dataSource: 'etherscan' as const,
        totalTransactions: linkArray.length,
        uniqueAddresses: nodeArray.length,
        centerAddress: normalizedCenterAddress,
        totalValue: linkArray.reduce((sum, link) => sum + link.val, 0)
      }
    };
  }
  export function transformToTransactionTableData(
    transactions: EtherscanTransaction[],
    centerAddress: string
  ): TransactionTableData[] {
    const normalizedCenterAddress = centerAddress.toLowerCase();
    
    return transactions.map(tx => {
      const fromAddress = tx.from.toLowerCase();
      const toAddress = tx.to?.toLowerCase() ?? '';
      
      // Calculate transaction type
      const type: TransactionType = fromAddress === normalizedCenterAddress 
        ? 'outgoing' 
        : 'incoming';
  
      // Calculate amount in ETH
      const amount = (parseFloat(tx.value) / CONFIG.WEI_TO_ETH).toFixed(6);
  
      // Calculate gas cost in ETH
      // Calculate gas cost in ETH using BigInt
      const gasCostInWei = BigInt(tx.gasUsed) * BigInt(tx.gasPrice);
      const gasCostInEth = (
        (gasCostInWei * BigInt(1000000)) / BigInt(CONFIG.WEI_TO_ETH)
        ).toString();
      const formattedGasCost = (parseInt(gasCostInEth) / 1000000).toFixed(6);
  
      // Format UTC timestamp
      const utcTimestamp = new Date(parseInt(tx.timeStamp) * 1000)
        .toISOString()
        .replace('T', ' ')
        .slice(0, 19) + ' UTC';
  
      return {
        type,
        hash: tx.hash,
        amount: `${amount} ETH`,
        from: fromAddress,
        to: toAddress,
        timestamp: utcTimestamp,
        status: tx.isError === '0' ? 'success' : 'failed',
        gasUsed: `${formattedGasCost} ETH`
      };
    });
  }

  export function transformToWalletBalance(address:string,balanceData:string):WalletBalance{
    try {
      // Ensure we have a valid balance string
      if (!balanceData) {
        return {
          address: address,
          balance: {
            eth: "0.000000",
          },
        };
      }
    // Convert wei to ETH
    const balanceInEth = (
      BigInt(balanceData) * BigInt(1000000) / BigInt(CONFIG.WEI_TO_ETH)
    ).toString();
  
    // Convert to number with 6 decimal places
    const formattedBalance = (parseInt(balanceInEth) / 1000000).toFixed(6);

    return {
      address:address,
      balance: {
        eth: formattedBalance,
      },
    };
  }catch (error) {
    console.error("Error transforming wallet balance:", error);
    return {
      address: address,
      balance: {
        eth: "0.000000",
      },
    };
  }
}