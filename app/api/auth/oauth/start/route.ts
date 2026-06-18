import { NextResponse } from 'next/server';
import createInsforgeServer from '@/lib/insforge-server';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const provider = url.searchParams.get('provider');
    const redirectTo = url.searchParams.get('redirectTo') || `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard`;

    if (!provider) {
      return NextResponse.json({ error: 'Missing provider' }, { status: 400 });
    }

    const insforge = createInsforgeServer();

    // Request the OAuth start URL from the server-side SDK
    const result = await insforge.auth.signInWithOAuth({ provider, redirectTo, skipBrowserRedirect: true } as any);

    if (result.error) {
      return NextResponse.json({ error: result.error.message || 'Failed to start OAuth' }, { status: 502 });
    }

    const dataUrl = result.data?.url;
    if (!dataUrl) {
      return NextResponse.json({ error: 'No URL returned by provider' }, { status: 502 });
    }

    return NextResponse.json({ url: dataUrl });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || String(err) }, { status: 500 });
  }
}

export const runtime = 'edge';
