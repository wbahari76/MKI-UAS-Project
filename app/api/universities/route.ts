import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');

  if (!query) {
    return NextResponse.json([]);
  }

  try {
    // The Hipolabs API does not support HTTPS, so we proxy the HTTP request 
    // through our Next.js backend to avoid Mixed Content errors in the browser on Vercel.
    const res = await fetch(`http://universities.hipolabs.com/search?name=${encodeURIComponent(query)}`);
    if (!res.ok) {
      throw new Error("API responded with an error");
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("University fetch error:", error);
    return NextResponse.json({ error: 'Failed to fetch universities' }, { status: 500 });
  }
}
