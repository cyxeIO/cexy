import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const host = req.headers.get("host") || "";
  let key = "";
  
  // Debug logging
  console.log(`[Validation Key API] Host: ${host}`);

  if (host.startsWith("test.") || host.includes("localhost")) {
    // Test environment key (includes localhost for development)
    key = "df1c0674eaa1d51790cbcb3a4756a192be3da853b401c0dee4a9d12df74216cfebbb4f0a4893beb920eb0fec903e5e451aa8042071bbe763384806d68baffca7";
    console.log(`[Validation Key API] Using TEST key for host: ${host}`);
  } else if (host === "cexy.ai" || host.startsWith("www.cexy.ai")) {
    // Production environment key (exact match for cexy.ai, not test.cexy.ai)
    key = "0ef961d3df7cf459f451c6779fffe42d7a1ef4769c44d5174912a0d66f544a682447b9e043ec7de705e8bf94cc2bd559c5cbe5dc4045ff5c54595352f0c94c0f";
    console.log(`[Validation Key API] Using PRODUCTION key for host: ${host}`);
  } else {
    // Fallback for unknown domains (use production key)
    key = "0ef961d3df7cf459f451c6779fffe42d7a1ef4769c44d5174912a0d66f544a682447b9e043ec7de705e8bf94cc2bd559c5cbe5dc4045ff5c54595352f0c94c0f";
    console.log(`[Validation Key API] Using FALLBACK (production) key for unknown host: ${host}`);
  }

  return new Response(key, {
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "public, max-age=3600", // Cache for 1 hour
    },
  });
}
