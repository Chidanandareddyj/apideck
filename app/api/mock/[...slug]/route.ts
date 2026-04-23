
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string[] } }
) {
  const [slug, ...pathParts] = params.slug; // first segment is the slug

  const data = await prisma.mockEndpoint.findFirst({
    where: { slug },
  });

  if (!data) {
    return Response.json({ error: "Endpoint not found" }, { status: 404 });
  }

  if (data.expiresAt && new Date(data.expiresAt) < new Date()) {
    return Response.json({ error: "Endpoint expired" }, { status: 410 });
  }

  let result = data.response as any;

  // If the fixture is an array and path has a second segment, treat it as an ID lookup
  // e.g. /mock/abc123/users/3  -> response[3] or response.find(x => x.id == 3)
  if (Array.isArray(result) && pathParts.length > 1) {
    const id = pathParts[pathParts.length - 1];
    result =
      result.find((item: any) => String(item?.id) === id) ??
      result[parseInt(id, 10)] ??
      { error: "Item not found" };
  }

  // ?limit and ?page support
  const url = req.nextUrl;
  const limit = parseInt(url.searchParams.get("limit") ?? "0", 10);
  const page = parseInt(url.searchParams.get("page") ?? "1", 10);

  if (Array.isArray(result) && limit > 0) {
    const start = (page - 1) * limit;
    result = result.slice(start, start + limit);
  }

  // bump hit count async (fire and forget)
  // NOTE: Keep as a placeholder until the model includes a counter field.

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if ((data as any).cors) {
    headers["Access-Control-Allow-Origin"] = "*";
    headers["Access-Control-Allow-Methods"] = "GET, OPTIONS";
  }

  return new Response(JSON.stringify(result, null, 2), { headers });
}

// handle CORS preflight
export async function OPTIONS() {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
    },
  });
}