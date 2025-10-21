import { databaseName, isDevelopment } from '@/env';
import { healthCheck } from '@/lib/mongodb';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const dbHealthy = await healthCheck();
    
    return NextResponse.json({
      status: dbHealthy ? 'ok' : 'error',
      environment: isDevelopment ? 'development' : 'production',
      database: databaseName,
      connected: dbHealthy,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      environment: isDevelopment ? 'development' : 'production',
      database: databaseName,
      connected: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}