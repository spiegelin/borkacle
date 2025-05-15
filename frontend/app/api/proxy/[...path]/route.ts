import { NextRequest } from 'next/server';

// Define handlers for common methods
export async function GET(req: NextRequest) {
  return handleProxyRequest(req);
}

export async function POST(req: NextRequest) {
  return handleProxyRequest(req);
}

export async function PUT(req: NextRequest) {
  return handleProxyRequest(req);
}

export async function DELETE(req: NextRequest) {
  return handleProxyRequest(req);
}

// Central handler function
async function handleProxyRequest(req: NextRequest) {
  // Extract the path *after* '/api/proxy/'
  // Example: /api/proxy/auth/login -> auth/login
  const path = req.nextUrl.pathname.replace('/api/proxy/', '');
  const searchParams = req.nextUrl.searchParams.toString();

  // Construct the target URL for the controller service
  const controllerBaseUrl = process.env.CONTROLLER_SERVICE_URL || 'localhost:8080';
  const cleanBaseUrl = controllerBaseUrl.replace(/^https?:\/\//, '');
  // Construct target: http://controller:8080/auth/login?params
  const targetUrl = `http://${cleanBaseUrl}/${path}${searchParams ? `?${searchParams}` : ''}`;

  console.log(`Proxying request: ${req.method} ${req.nextUrl.pathname} -> ${targetUrl}`);

  // Prepare headers for forwarding
  const headersToForward = new Headers();
  req.headers.forEach((value, key) => {
    // Avoid forwarding problematic headers like Host, Content-Length (fetch calculates it)
    if (!['host', 'content-length'].includes(key.toLowerCase())) {
      headersToForward.append(key, value);
    }
  });

  //console.log(`Headers to forward: ${JSON.stringify(Object.fromEntries(headersToForward.entries()))}`);

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: headersToForward, // Use the filtered headers
      // Pass through the body only if it exists (e.g., for POST, PUT)
      body: req.body,
      // IMPORTANT: Prevent infinite loop if fetch needs to be patched
      cache: 'no-store',
      // @ts-ignore // Required for Next.js fetch patching with body
      duplex: 'half'
    });

    console.log(`Received response from controller: ${response.status} ${response.statusText} for ${targetUrl}`);

    // Forward the response from the controller back to the client
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers, // Pass back headers from the controller response
    });
  } catch (error: any) {
    console.error(`Proxy fetch failed for ${targetUrl}:`, error); // Log the full error object
    // Provide a more informative error response
    return new Response(JSON.stringify({ 
        error: 'Proxy failed', 
        details: 'fetch failed', 
        target: targetUrl, 
        proxyError: error.message || 'Unknown fetch error',
        cause: error.cause // Include cause if available (Node >= 16.9)
    }), {
      status: 502, // Bad Gateway
      headers: { 'Content-Type': 'application/json' },
    });
  }
} 