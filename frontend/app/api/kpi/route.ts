export async function GET() {
  return new Response(JSON.stringify({ message: "This API route is deprecated" }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
} 