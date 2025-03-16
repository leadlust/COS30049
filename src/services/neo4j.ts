import neo4j, { Driver } from 'neo4j-driver';
import { parse } from 'csv-parse';
import {UploadedFile} from '@/types/file'
import { createReadStream } from 'fs';
import { 
  NodeData, 
  RelationshipData, 
  AddressHistoricalData, 
} from '@/types/neo4j';


export class Neo4jService {
  private driver: Driver;

  constructor() {
    this.driver = neo4j.driver(
      process.env.NEO4J_URI || 'bolt://localhost:7687',
      neo4j.auth.basic(
        process.env.NEO4J_USER || 'neo4j',
        process.env.NEO4J_PASSWORD || 'password'
      )
    );
  }

  async init() {
    const session = this.driver.session();
    try {
      // First, check and drop existing index if it exists
      await session.run(`
        CALL apoc.schema.assert({},{})
      `);

      // Then create the constraint
      await session.run(`
        CREATE CONSTRAINT address_unique IF NOT EXISTS
        FOR (n:Address) REQUIRE n.address IS UNIQUE
      `);

      // Create transaction hash index
      await session.run(`
        CREATE INDEX transaction_hash_index IF NOT EXISTS
        FOR ()-[r:TRANSFERRED]-()
        ON r.hash
      `);

      console.log('Database schema initialized successfully');
    } catch (error) {
      console.error('Error initializing database schema:', error);
      throw error;
    } finally {
      await session.close();
    }
  }

  async validateNodesCsv(file: UploadedFile): Promise<{ isValid: boolean; errors: string[] }> {
    const errors: string[] = [];
    let lineNumber = 0;
    console.log(`Starting nodes CSV validation for file: ${file.filename}`);

    return new Promise((resolve) => {
      createReadStream(file.path)
        .pipe(parse({ columns: true, skip_empty_lines: true }))
        .on('data', (row: NodeData) => {
          lineNumber++;
          
          // Check required fields, using addressId instead of address
          if (!row.addressId || !row.type) {
            const missingFields = [];
            if (!row.addressId) missingFields.push('addressId');
            if (!row.type) missingFields.push('type');
            errors.push(`Line ${lineNumber}: Missing required fields: ${missingFields.join(', ')}`);
          }

          // Validate address format using addressId
          if (row.addressId && !/^0x[a-fA-F0-9]{40}$/.test(row.addressId)) {
            errors.push(`Line ${lineNumber}: Invalid address format: ${row.addressId}`);
          }

          // Validate type
          if (row.type && !['eoa', 'contract'].includes(row.type.toLowerCase())) {
            errors.push(`Line ${lineNumber}: Invalid type '${row.type}' (must be 'eoa' or 'contract')`);
          }
        })
        .on('end', () => {
          console.log(`Completed nodes validation. Found ${errors.length} errors`);
          if (errors.length > 0) {
            console.log('Validation errors:', errors);
          }
          resolve({ isValid: errors.length === 0, errors });
        });
    });
  }

  async validateRelationshipsCsv(file: UploadedFile): Promise<{ isValid: boolean; errors: string[] }> {
    const errors: string[] = [];
    let lineNumber = 0;
    console.log(`Starting relationships CSV validation for file: ${file.filename}`);

    return new Promise((resolve) => {
      createReadStream(file.path)
        .pipe(parse({ columns: true, skip_empty_lines: true }))
        .on('data', (row: Partial<RelationshipData>) => {
          lineNumber++;
          
          // Check required fields using the interface
          const requiredFields: (keyof RelationshipData)[] = [
            'from_address', 'to_address', 'hash', 'value',
            'gas', 'gas_used', 'gas_price', 'block_number'
          ];

          const missingFields = requiredFields.filter(field => !row[field]);
          if (missingFields.length > 0) {
            errors.push(`Line ${lineNumber}: Missing required fields: ${missingFields.join(', ')}`);
          }

          // Validate addresses
          if (row.from_address && !/^0x[a-fA-F0-9]{40}$/.test(row.from_address)) {
            errors.push(`Line ${lineNumber}: Invalid from_address format: ${row.from_address}`);
          }
          if (row.to_address && !/^0x[a-fA-F0-9]{40}$/.test(row.to_address)) {
            errors.push(`Line ${lineNumber}: Invalid to_address format: ${row.to_address}`);
          }

          // Validate numeric fields
          const numericFields: (keyof RelationshipData)[] = ['value', 'gas', 'gas_used', 'gas_price', 'block_number'];
          for (const field of numericFields) {
            if (row[field] && isNaN(Number(row[field]))) {
              errors.push(`Line ${lineNumber}: Invalid numeric value for ${field}: ${row[field]}`);
            }
          }
        })
        .on('end', () => {
          console.log(`Completed relationships validation. Found ${errors.length} errors`);
          if (errors.length > 0) {
            console.log('Validation errors:', errors);
          }
          resolve({ isValid: errors.length === 0, errors });
        })
        .on('error', (error) => {
          console.error('Error during relationships CSV validation:', error);
          errors.push(`File reading error: ${error.message}`);
          resolve({ isValid: false, errors });
        });
    });
  }

  async validateDataConsistency(nodesFile: UploadedFile, relationshipsFile: UploadedFile): Promise<{ 
    isValid: boolean; 
    errors: string[];
    stats: {
      uniqueNodesInNodesCsv: number;
      uniqueAddressesInRelationships: number;
      addressesInRelationshipsNotInNodes: string[];
    }
  }> {
    const errors: string[] = [];
    const nodesAddresses = new Set<string>();
    const relationshipAddresses = new Set<string>();
    const missingAddresses = new Set<string>();

    console.log('Starting data consistency validation...');

    // First, read all addresses from nodes.csv
    const nodesStream = createReadStream(nodesFile.path)
      .pipe(parse({ columns: true, skip_empty_lines: true }));

    for await (const row of nodesStream) {
      if (row.addressId) {
        nodesAddresses.add(row.addressId.toLowerCase());
      }
    }

    console.log(`Found ${nodesAddresses.size} unique addresses in nodes.csv`);

    // Then, check all addresses in relationships.csv
    const relationshipsStream = createReadStream(relationshipsFile.path)
      .pipe(parse({ columns: true, skip_empty_lines: true }));

    for await (const row of relationshipsStream) {
      if (row.from_address) {
        relationshipAddresses.add(row.from_address.toLowerCase());
        if (!nodesAddresses.has(row.from_address.toLowerCase())) {
          missingAddresses.add(row.from_address.toLowerCase());
        }
      }
      if (row.to_address) {
        relationshipAddresses.add(row.to_address.toLowerCase());
        if (!nodesAddresses.has(row.to_address.toLowerCase())) {
          missingAddresses.add(row.to_address.toLowerCase());
        }
      }
    }

    if (missingAddresses.size > 0) {
      errors.push(`Found ${missingAddresses.size} addresses in relationships.csv that are not present in nodes.csv`);
      console.log('Missing addresses:', Array.from(missingAddresses));
    }

    return {
      isValid: missingAddresses.size === 0,
      errors,
      stats: {
        uniqueNodesInNodesCsv: nodesAddresses.size,
        uniqueAddressesInRelationships: relationshipAddresses.size,
        addressesInRelationshipsNotInNodes: Array.from(missingAddresses)
      }
    };
  }

  async uploadNodes(file: UploadedFile): Promise<void> {
    const session = this.driver.session();
    let totalRows = 0;
    let processedRows = 0;
    let failedRows = 0;
    const failedEntries: Array<{row: number, error: string}> = [];

    try {
      console.log(`Starting to upload nodes from file: ${file.filename}`);
      
      const stream = createReadStream(file.path)
        .pipe(parse({ columns: true, skip_empty_lines: true }));

      for await (const row of stream) {
        totalRows++;
        try {
          // Log the raw row data for debugging
          console.log(`Processing row ${totalRows}:`, row);

          if (!row.addressId || !row.type) {
            failedRows++;
            failedEntries.push({
              row: totalRows,
              error: `Missing required fields: ${!row.addressId ? 'addressId ' : ''}${!row.type ? 'type' : ''}`
            });
            continue;
          }

          const nodeData: NodeData = {
            addressId: row.addressId.toLowerCase(),
            type: row.type.toLowerCase() as 'eoa' | 'contract'
          };

          // Execute the Cypher query to merge and update node
          const result = await session.run(`
            MERGE (n:Address {address: $addressId})
            SET n.type = $type
            RETURN n
          `, nodeData);

          if (result.records.length > 0) {
            processedRows++;
            if (processedRows % 50 === 0) {
              console.log(`Processed ${processedRows} nodes so far...`);
            }
          }

        } catch (error) {
          failedRows++;
          failedEntries.push({
            row: totalRows,
            error: error instanceof Error ? error.message : 'Unknown error'
          });
          console.error(`Error processing row ${totalRows}:`, error);
        }
      }

      // Final statistics
      console.log('\nUpload Summary:');
      console.log(`Total rows processed: ${totalRows}`);
      console.log(`Successfully uploaded/updated: ${processedRows}`);
      console.log(`Failed rows: ${failedRows}`);
      
      if (failedEntries.length > 0) {
        console.log('\nFailed entries:');
        failedEntries.forEach(entry => {
          console.log(`Row ${entry.row}: ${entry.error}`);
        });
      }

      // Verify the total number of nodes in the database
      const countResult = await session.run('MATCH (n:Address) RETURN count(n) as count');
      const totalNodesInDb = countResult.records[0].get('count').toNumber();
      console.log(`\nTotal nodes in database: ${totalNodesInDb}`);

    } catch (error) {
      console.error('Fatal error during node upload:', error);
      throw error;
    } finally {
      await session.close();
    }
  }

  async uploadRelationships(file: UploadedFile): Promise<void> {
    const session = this.driver.session();
    let totalRows = 0;
    let processedRows = 0;
    let failedRows = 0;
    const failedEntries: Array<{row: number, error: string}> = [];
  
    try {
      console.log(`Starting to upload relationships from file: ${file.filename}`);
      
      const stream = createReadStream(file.path)
        .pipe(parse({ columns: true, skip_empty_lines: true }));
  
      for await (const row of stream) {
        totalRows++;
        try {
          // Check required fields
          const requiredFields = [
            'from_address', 'to_address', 'hash', 'value',
            'gas', 'gas_used', 'gas_price', 'block_number'
          ];
  
          const missingFields = requiredFields.filter(field => !row[field]);
          if (missingFields.length > 0) {
            failedRows++;
            failedEntries.push({
              row: totalRows,
              error: `Missing required fields: ${missingFields.join(', ')}`
            });
            continue;
          }
  
          const relationshipData: RelationshipData = {
            from_address: row.from_address.toLowerCase(),
            to_address: row.to_address.toLowerCase(),
            hash: row.hash,
            value: row.value,
            input: row.input || '',
            transaction_index: parseInt(row.transaction_index) || 0,
            gas: parseInt(row.gas),
            gas_used: parseInt(row.gas_used),
            gas_price: parseInt(row.gas_price),
            transaction_fee: parseFloat(row.transaction_fee) || 0,
            block_number: parseInt(row.block_number),
            block_hash: row.block_hash || '',
            block_timestamp: parseInt(row.block_timestamp) || 0
          };
  
          // Create or match nodes and create relationship in a single transaction
          const result = await session.run(`
            // Match or create nodes with default type 'eoa'
            MERGE (from:Address {address: $from_address})
            ON CREATE SET from.type = 'eoa'
            MERGE (to:Address {address: $to_address})
            ON CREATE SET to.type = 'eoa'
            
            // Create the relationship
            MERGE (from)-[r:TRANSFERRED {hash: $hash}]->(to)
            SET r += $properties
            RETURN r
          `, {
            ...relationshipData,
            properties: {
              value: relationshipData.value,
              input: relationshipData.input,
              transaction_index: relationshipData.transaction_index,
              gas: relationshipData.gas,
              gas_used: relationshipData.gas_used,
              gas_price: relationshipData.gas_price,
              transaction_fee: relationshipData.transaction_fee,
              block_number: relationshipData.block_number,
              block_hash: relationshipData.block_hash,
              block_timestamp: relationshipData.block_timestamp
            }
          });
  
          if (result.records.length > 0) {
            processedRows++;
            if (processedRows % 50 === 0) {
              console.log(`Processed ${processedRows} relationships so far...`);
            }
          }
  
        } catch (error) {
          failedRows++;
          failedEntries.push({
            row: totalRows,
            error: error instanceof Error ? error.message : 'Unknown error'
          });
          console.error(`Error processing relationship row ${totalRows}:`, error);
        }
      }
  
      // Final statistics
      console.log('\nRelationships Upload Summary:');
      console.log(`Total rows processed: ${totalRows}`);
      console.log(`Successfully uploaded: ${processedRows}`);
      console.log(`Failed/Skipped rows: ${failedRows}`);
      
      if (failedEntries.length > 0) {
        console.log('\nFailed/Skipped entries:');
        failedEntries.forEach(entry => {
          console.log(`Row ${entry.row}: ${entry.error}`);
        });
      }
  
      // Verify the total number of relationships in the database
      const countResult = await session.run('MATCH ()-[r:TRANSFERRED]->() RETURN count(r) as count');
      const totalRelsInDb = countResult.records[0].get('count').toNumber();
      console.log(`\nTotal relationships in database: ${totalRelsInDb}`);
  
    } catch (error) {
      console.error('Fatal error during relationships upload:', error);
      throw error;
    } finally {
      await session.close();
    }
  }

  async getOneHopNetwork(address: string) {
    const session = this.driver.session();
    try {
      const result = await session.run(`
        MATCH (n:Address {address: $address})
        OPTIONAL MATCH (n)-[r:TRANSFERRED]->(out:Address)
        OPTIONAL MATCH (in:Address)-[r2:TRANSFERRED]->(n)
        RETURN n, collect(distinct r) as outgoing, 
               collect(distinct out) as outNodes,
               collect(distinct r2) as incoming,
               collect(distinct in) as inNodes
      `, { address: address.toLowerCase() });

      return result.records[0];
    } finally {
      await session.close();
    }
  }

  async getAddressHistoricalData(address: string): Promise<AddressHistoricalData | null> {
    const session = this.driver.session();
    try {
      const result = await session.run(`
        MATCH (n:Address {address: $address})
        
        // Get outgoing transactions
        OPTIONAL MATCH (n)-[out:TRANSFERRED]->(toAddr)
        
        // Get incoming transactions
        OPTIONAL MATCH (fromAddr)-[in:TRANSFERRED]->(n)
        
        // Calculate totals
        WITH n,
             collect(DISTINCT {
               hash: out.hash,
               value: out.value,
               from_address: n.address,
               to_address: toAddr.address,
               gas: out.gas,
               gas_used: out.gas_used,
               gas_price: out.gas_price,
               transaction_fee: out.transaction_fee,
               block_number: out.block_number,
               block_timestamp: out.block_timestamp,
               input: out.input
             }) as outgoingTxs,
             collect(DISTINCT {
               hash: in.hash,
               value: in.value,
               from_address: fromAddr.address,
               to_address: n.address,
               gas: in.gas,
               gas_used: in.gas_used,
               gas_price: in.gas_price,
               transaction_fee: in.transaction_fee,
               block_number: in.block_number,
               block_timestamp: in.block_timestamp,
               input: in.input
             }) as incomingTxs,
             sum(CASE WHEN out IS NOT NULL THEN toFloat(out.value) ELSE 0 END) as totalOut,
             sum(CASE WHEN in IS NOT NULL THEN toFloat(in.value) ELSE 0 END) as totalIn
        
        RETURN {
          address: {
            address: n.address,
            type: n.type
          },
          incomingTransactions: incomingTxs,
          outgoingTransactions: outgoingTxs,
          totalIncoming: toString(totalIn),
          totalOutgoing: toString(totalOut),
          totalTransactions: size(incomingTxs) + size(outgoingTxs)
        } as result
      `, { address: address.toLowerCase() });

      if (result.records.length === 0) {
        return null;
      }

      return result.records[0].get('result') as AddressHistoricalData;
    } finally {
      await session.close();
    }
  }

  async searchAddresses(searchTerm: string): Promise<Array<{address: string; type: string}>> {
    const session = this.driver.session();
    try {
      const result = await session.run(`
        MATCH (n:Address)
        WHERE n.address CONTAINS $searchTerm
        RETURN n.address as address, n.type as type
        LIMIT 10
      `, { searchTerm: searchTerm.toLowerCase() });

      return result.records.map(record => ({
        address: record.get('address'),
        type: record.get('type')
      }));
    } finally {
      await session.close();
    }
  }
}

