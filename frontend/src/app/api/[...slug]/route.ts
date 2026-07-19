import { NextRequest, NextResponse } from 'next/server';

// Fallback to localhost for local dev outside Docker
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string[] }> }) {
  const resolvedParams = await params;
  return handleProxy(req, resolvedParams.slug);
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string[] }> }) {
  const resolvedParams = await params;
  return handleProxy(req, resolvedParams.slug);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ slug: string[] }> }) {
  const resolvedParams = await params;
  return handleProxy(req, resolvedParams.slug);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ slug: string[] }> }) {
  const resolvedParams = await params;
  return handleProxy(req, resolvedParams.slug);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ slug: string[] }> }) {
  const resolvedParams = await params;
  return handleProxy(req, resolvedParams.slug);
}


async function handleProxy(req: NextRequest, slug: string[]) {
  const token = req.headers.get('authorization') || '';
  const fiscalYearId = req.headers.get('x-fiscal-year-id') || '';
  
  // Reconstruct the path after /api/
  const path = slug.join('/');
  
  // Extract query string
  const url = new URL(req.url);
  const searchParams = url.search;
  
  const targetUrl = `${BACKEND_URL}/api/${path}${searchParams}`;

  try {
    const headers: Record<string, string> = {
      'Content-Type': req.headers.get('content-type') || 'application/json',
    };
    if (token) headers['Authorization'] = token;
    if (fiscalYearId) headers['X-Fiscal-Year-Id'] = fiscalYearId;

    let body = null;
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      body = await req.text();
    }

    const res = await fetch(targetUrl, {
      method: req.method,
      headers,
      body: body ? body : undefined,
    });

    const responseHeaders = new Headers(res.headers);
    responseHeaders.set('Access-Control-Allow-Origin', '*');

    // Return the response as is
    const data = await res.text();
    return new NextResponse(data, {
      status: res.status,
      headers: responseHeaders,
    });
  } catch (err) {
    console.error(`[API Proxy] Backend unreachable at ${targetUrl}:`, err);
    return NextResponse.json(
      { message: 'Backend server सँग जडान हुन सकिएन।' },
      { status: 503 }
    );
  }
}
