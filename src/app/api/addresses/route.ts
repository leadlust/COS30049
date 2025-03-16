import { NextResponse } from 'next/server';
import { Neo4jService } from '@/services/neo4j';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';
import { UploadedFile } from '@/types/file';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const nodesFile = formData.get('nodes') as File;

    console.log('Received nodes upload request:', {
      nodesFileName: nodesFile?.name,
      nodesFileSize: nodesFile?.size,
    });

    if (!nodesFile) {
      return NextResponse.json(
        { error: 'Missing nodes file' },
        { status: 400 }
      );
    }

    // Save file temporarily
    const nodesPath = join(tmpdir(), 'nodes.csv');
    console.log('Saving nodes file temporarily:', { nodesPath });
    await writeFile(nodesPath, Buffer.from(await nodesFile.arrayBuffer()));

    const nodesUploadedFile: UploadedFile = {
      path: nodesPath,
      filename: nodesFile.name,
      size: nodesFile.size,
      mimetype: nodesFile.type
    };

    const neo4jService = new Neo4jService();

    // Validate file format
    console.log('Validating nodes file format...');
    const nodesValidation = await neo4jService.validateNodesCsv(nodesUploadedFile);

    if (!nodesValidation.isValid) {
      return NextResponse.json({
        error: 'CSV validation failed',
        nodesErrors: nodesValidation.errors
      }, { status: 400 });
    }

    // Initialize database schema
    await neo4jService.init();

    // Upload nodes
    await neo4jService.uploadNodes(nodesUploadedFile);

    return NextResponse.json({ 
      success: true,
      message: 'Nodes uploaded successfully'
    });

  } catch (error) {
    console.error('Nodes upload error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Upload failed' },
      { status: 500 }
    );
  }
}