import "server-only";
import { Caveat, Inter, JetBrains_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import CopyUrlButton from "./CopyUrlButton";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

type PageProps = {
  params: Promise<{ slug: string[] }>;
};

type JsonPrimitive = string | number | boolean | null;
type JsonValue = JsonPrimitive | JsonObject | JsonValue[];
type JsonObject = { [key: string]: JsonValue };

type MockResponseShape = {
  data?: JsonValue[] | JsonObject;
  suggestedPath?: string;
  itemCount?: number;
};

const inferFieldType = (value: JsonValue | undefined): string => {
  if (value === null || value === undefined) return "Unknown";
  if (typeof value === "string") {
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (uuidPattern.test(value)) return "UUID";
    if (!Number.isNaN(Date.parse(value))) return "Date";
    return "String";
  }
  if (typeof value === "number") return Number.isInteger(value) ? "Integer" : "Float";
  if (typeof value === "boolean") return "Boolean";
  if (Array.isArray(value)) return "Array";
  return "Object";
};

export default async function MockApiReady({ params }: PageProps) {
  const resolvedParams = await params;
  const [slug] = resolvedParams.slug;

  if (!slug) {
    notFound();
  }

  const endpoint = await prisma.mockEndpoint.findFirst({
    where: { slug },
  });

  if (!endpoint) {
    notFound();
  }

  const parsedResponse = endpoint.response as unknown as MockResponseShape;
  const responseData = parsedResponse?.data;
  const firstRecord = Array.isArray(responseData)
    ? (responseData[0] as JsonObject | undefined)
    : ((responseData as JsonObject | undefined) ?? undefined);
  const schemaEntries = Object.entries(firstRecord ?? {});
  const suggestedPath = parsedResponse?.suggestedPath ?? "";
  const mockApiPath = suggestedPath ? `/api/mock/${slug}${suggestedPath}` : `/api/mock/${slug}`;
  const baseUrl = process.env.BASE_URL ?? "";
  const absoluteMockApiPath = baseUrl ? `${baseUrl}${mockApiPath}` : mockApiPath;

  return (
    <section
      className={`${inter.className} relative h-screen w-screen overflow-hidden bg-white text-gray-900 antialiased`}
    >
      <nav className="fixed left-0 top-0 z-50 flex w-full items-center justify-between bg-white/50 px-8 py-6 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-900">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight">apideck</span>
        </div>

        <div className="hidden gap-8 text-sm font-medium text-gray-500 md:flex">
          <a href="#" className="transition-colors hover:text-gray-900">
            Documentation
          </a>
          <a href="#" className="transition-colors hover:text-gray-900">
            Examples
          </a>
          <a href="#" className="transition-colors hover:text-gray-900">
            Pricing
          </a>
        </div>

        <div>
          <a
            href="#"
            className="rounded-full bg-gray-100 px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-gray-200"
          >
            Sign in
          </a>
        </div>
      </nav>

      <main className="flex h-full w-full flex-col items-center justify-center px-8">
        <div className="w-full max-w-5xl">
          <h1 className={`${caveat.className} mb-16 text-center text-6xl text-gray-900`}>Your API is ready!</h1>

          <div className="grid grid-cols-1 items-stretch gap-12 md:grid-cols-2">
            <div className="rounded-[2.5rem] bg-emerald-100 p-10 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05),0_0_20px_0_rgba(0,0,0,0.02)]">
              <div className="mb-8 flex items-center justify-between">
                <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-800/60">Generated Schema</h2>
                <span className={`${jetbrainsMono.className} rounded-full bg-emerald-200/50 px-2 py-0.5 text-[10px] text-emerald-700`}>
                  {parsedResponse?.itemCount ? `${parsedResponse.itemCount} items` : "Generated"}
                </span>
              </div>

              <div className="space-y-4">
                {schemaEntries.length > 0 ? (
                  schemaEntries.map(([field, value]) => (
                    <div key={field} className="flex items-center justify-between rounded-2xl border border-emerald-100/50 bg-white/40 p-4">
                      <span className={`${jetbrainsMono.className} font-semibold text-gray-800`}>{field}</span>
                      <span className={`${jetbrainsMono.className} rounded bg-emerald-100/50 px-2 py-1 text-xs text-emerald-600`}>
                        {inferFieldType(value)}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border border-emerald-100/50 bg-white/40 p-4">
                    <span className={`${jetbrainsMono.className} text-sm text-gray-600`}>Schema unavailable.</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col justify-center">
              <div className="mb-10">
                <h2 className="mb-6 text-xs font-bold uppercase tracking-widest text-gray-400">Live Endpoint</h2>
                <div className="flex flex-col gap-4">
                  <div className="group flex items-center justify-between gap-4 rounded-2xl border border-gray-100 bg-gray-50 p-6 transition-colors hover:border-gray-200">
                    <code className={`${jetbrainsMono.className} truncate text-lg text-gray-600`}>
                      {absoluteMockApiPath}
                    </code>
                    <CopyUrlButton url={absoluteMockApiPath} />
                  </div>

                  <div className="flex items-center gap-3 px-2">
                    <div className="relative flex h-3 w-3 items-center justify-center">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                    </div>
                    <span className="text-sm font-semibold uppercase tracking-wide text-emerald-600">
                      Live &amp; Accepting Requests
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <p className="max-w-sm leading-relaxed text-gray-500">
                  Your mock API is now public. You can start sending GET requests to the endpoint above and receive data based on your schema.
                </p>
                <div className="flex gap-4 pt-4">
                  <button type="button" className="border-b-2 border-gray-900 pb-1 text-sm font-bold text-gray-900">
                    Open in Playground
                  </button>
                  <button type="button" className="pb-1 text-sm font-bold text-gray-400 transition-colors hover:text-gray-600">
                    View Docs
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className="pointer-events-none absolute inset-0 z-[-1] opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
      </main>

    </section>
  );
}
