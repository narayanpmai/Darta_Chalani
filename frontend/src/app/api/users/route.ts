import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

/**
 * /api/users — Proxy to .NET Backend Users API
 * This Next.js route forwards requests to the real backend.
 * No more JSON file storage — data lives in PostgreSQL.
 */
export async function GET(req: NextRequest) {
  const token = req.headers.get('authorization') || '';
  const fiscalYearId = req.headers.get('x-fiscal-year-id') || '';

  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) headers['Authorization'] = token;
    if (fiscalYearId) headers['X-Fiscal-Year-Id'] = fiscalYearId;

    const res = await fetch(`${BACKEND_URL}/api/users`, { headers });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ message: 'Backend error' }));
      return NextResponse.json(error, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error('[/api/users GET] Backend unreachable:', err);
    return NextResponse.json(
      { message: 'Backend server सँग जडान हुन सकिएन।' },
      { status: 503 }
    );
  }
}

export async function POST(req: NextRequest) {
  const token = req.headers.get('authorization') || '';
  const body = await req.json().catch(() => null);

  try {
    const res = await fetch(`${BACKEND_URL}/api/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': token } : {}),
      },
      body: JSON.stringify(body),
    });

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error('[/api/users POST] Backend unreachable:', err);
    return NextResponse.json(
      { message: 'Backend server सँग जडान हुन सकिएन।' },
      { status: 503 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const token = req.headers.get('authorization') || '';
  const url = new URL(req.url);
  const pathAfterUsers = url.pathname.replace('/api/users', '');
  const body = await req.json().catch(() => null);

  try {
    const res = await fetch(`${BACKEND_URL}/api/users${pathAfterUsers}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': token } : {}),
      },
      body: JSON.stringify(body),
    });

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error('[/api/users PUT] Backend unreachable:', err);
    return NextResponse.json({ message: 'Backend server सँग जडान हुन सकिएन।' }, { status: 503 });
  }
}
