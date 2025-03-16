import { NextResponse } from 'next/server';
import neo4j from 'neo4j-driver';

export async function GET() {
  const driver = neo4j.driver(
    process.env.NEO4J_URI || 'bolt://localhost:7687',
    neo4j.auth.basic(
      process.env.NEO4J_USER || 'neo4j',
      process.env.NEO4J_PASSWORD || 'password'
    )
  );

  const session = driver.session();

  try {
    const result = await session.run(
      `MATCH (n)
       WHERE n.address IS NOT NULL
       RETURN DISTINCT n.address as address, 
              CASE 
                WHEN labels(n) = ['Contract'] THEN 'Contract'
                WHEN labels(n) = ['EOA'] THEN 'EOA'
                ELSE 'Unknown'
              END as type
       ORDER BY type, address
       LIMIT 1000`
    );

    const addresses = result.records.map(record => ({
      address: record.get('address'),
      type: record.get('type')
    }));

    return NextResponse.json({
      success: true,
      data: addresses
    });

  } catch (error) {
    console.error('Error fetching addresses:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch addresses' },
      { status: 500 }
    );
  } finally {
    await session.close();
    await driver.close();
  }
} 