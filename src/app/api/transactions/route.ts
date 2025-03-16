import { NextResponse } from 'next/server';
import { Neo4jService } from '@/services/neo4j';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';
import { UploadedFile } from '@/types/file';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const relationshipsFile = formData.get('relationships') as File;

    console.log('Received relationships upload request:', {
      relationshipsFileName: relationshipsFile?.name,
      relationshipsFileSize: relationshipsFile?.size
    });

    if (!relationshipsFile) {
      return NextResponse.json(
        { error: 'Missing relationships file' },
        { status: 400 }
      );
    }

    // Save file temporarily
    const relationshipsPath = join(tmpdir(), 'relationships.csv');
    console.log('Saving relationships file temporarily:', { relationshipsPath });
    await writeFile(relationshipsPath, Buffer.from(await relationshipsFile.arrayBuffer()));

    const relationshipsUploadedFile: UploadedFile = {
      path: relationshipsPath,
      filename: relationshipsFile.name,
      size: relationshipsFile.size,
      mimetype: relationshipsFile.type
    };

    const neo4jService = new Neo4jService();

    // Validate relationships file format
    console.log('Validating relationships file format...');
    const relationshipsValidation = await neo4jService.validateRelationshipsCsv(relationshipsUploadedFile);

    if (!relationshipsValidation.isValid) {
      return NextResponse.json({
        error: 'CSV validation failed',
        relationshipsErrors: relationshipsValidation.errors
      }, { status: 400 });
    }

    // Upload relationships
    await neo4jService.uploadRelationships(relationshipsUploadedFile);

    return NextResponse.json({ 
      success: true,
      message: 'Relationships uploaded successfully'
    });

  } catch (error) {
    console.error('Relationships upload error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Upload failed' },
      { status: 500 }
    );
  }
}