'use client';
import { useState, type CSSProperties, type KeyboardEvent, type ReactNode } from "react";
import { Caveat, Inter } from "next/font/google";
import { useRouter } from "next/navigation";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["600", "700"],
});

type FloatingCardProps = {
  className: string;
  style: CSSProperties;
  children: ReactNode;
};

function FloatingCard({ className, style, children }: FloatingCardProps) {
  return (
    <div className={`floating-card absolute cursor-default ${className}`} style={style}>
      {children}
    </div>
  );
}

export default function Home() {
  const router = useRouter();
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  type GenerateMockApiResponse = {
    id: string;
  };

  const generateMockApi = async (userPrompt: string): Promise<GenerateMockApiResponse> => {
    const response = await fetch("/api/generate",{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt: userPrompt }),
    });

    if (!response.ok) {
      throw new Error("Failed to generate mock API");
    }

    const data = await response.json();
    return data as GenerateMockApiResponse;
  };

  const handleSubmit = async (): Promise<void> => {
    const trimmedPrompt = prompt.trim();
    if (!trimmedPrompt || isGenerating) {
      return;
    }

    setIsGenerating(true);

    try {
      const generated = await generateMockApi(trimmedPrompt);
      router.push(`/generated/${generated.id}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePromptKeyDown = async (event: KeyboardEvent<HTMLTextAreaElement>): Promise<void> => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      await handleSubmit();
    }
  };

  return (
    <div className="w-[105.263%] origin-top-left scale-[0.95]">
      <section
        className={`${inter.className} relative min-h-screen w-full overflow-x-hidden bg-white text-gray-900 antialiased`}
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
          <span className="text-xl font-bold tracking-tight">API Deck</span>
        </div>

        <div className="absolute left-1/2 hidden -translate-x-1/2 gap-8 text-sm font-medium text-gray-500 md:flex">
          <a href="#documentation" className="transition-colors hover:text-gray-900">
            Documentation
          </a>
          <a href="#examples" className="transition-colors hover:text-gray-900">
            Examples
          </a>
        </div>

       
      </nav>

      <main className="relative flex min-h-screen w-full items-center justify-center">
        <div className="relative z-20 flex w-full max-w-2xl flex-col items-center px-6">
          <h1 className={`${caveat.className} mb-8 text-center text-3xl tracking-tight text-gray-900 md:text-5xl`}>
          Describe your API data in plain English and get instant mock REST endpoints
          </h1>

          <div className="group flex w-full flex-col gap-2 rounded-2xl border border-gray-100 bg-white p-2 shadow-2xl transition-all duration-300 focus-within:ring-4 focus-within:ring-sky-200/50">
            <div className="relative w-full">
              <textarea
                className="mock-api-textarea w-full resize-none bg-transparent px-3 pb-1 pt-2.5 text-base font-medium text-gray-800 outline-none placeholder:text-gray-400 md:text-lg"
                rows={2}
                placeholder="Describe your API in plain english... e.g. A list of 10 users with id, name, and profile pictures."
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                onKeyDown={handlePromptKeyDown}
              />
            </div>

            <div className="flex items-center justify-between px-2 pb-1">
              <div className="flex gap-2">
                <button
                  type="button"
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-50 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
                  title="Add Schema File"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                  </svg>
                </button>

              
              </div>

              <button
                type="button"
                className="flex min-w-[112px] items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-gray-900/20 transition-transform hover:bg-gray-800 active:scale-95 disabled:cursor-wait disabled:bg-gray-800 disabled:active:scale-100"
                onClick={handleSubmit}
                disabled={isGenerating}
                aria-busy={isGenerating}
              >
                {isGenerating ? "Generating" : "Generate"}
                {isGenerating ? (
                  <span className="generate-dots" aria-hidden="true">
                    <span />
                    <span />
                    <span />
                  </span>
                ) : (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <p className="mt-6 text-sm font-medium text-gray-400">
            Press
            <kbd className="mx-1 rounded border border-gray-200 bg-gray-100 px-2 py-1 font-sans text-xs text-gray-500">
              Enter ↵
            </kbd>
            to generate instantly
          </p>
        </div>

        <FloatingCard
          className="w-72 rounded-3xl bg-sky-100 p-6 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05),0_0_20px_0_rgba(0,0,0,0.02)] transition-transform duration-300 hover:scale-105 hover:shadow-[0_30px_60px_-20px_rgba(0,0,0,0.1),0_0_20px_0_rgba(0,0,0,0.02)]"
          style={{ top: "16%", left: "6%", zIndex: 10, ["--rotation" as string]: "-4deg", animationDelay: "0s" }}
        >
          <div className="mb-4 inline-block rounded-full bg-sky-200/50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-sky-800">
            Example Call
          </div>
          <div className="rounded-2xl border border-sky-100 bg-white/60 p-4 shadow-sm backdrop-blur-sm">
            <div className="mb-2 flex items-center gap-3 border-b border-sky-100 pb-2">
              <span className="rounded bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-700">GET</span>
              <span className="truncate font-mono text-sm text-gray-800">/api/v1/products</span>
            </div>
            <div className="space-y-1">
              <div className="flex items-center font-mono text-xs text-gray-500">
                <span className="w-16 text-sky-600">Headers</span>
                <span>{'{ "Auth": "Bearer..." }'}</span>
              </div>
              <div className="flex items-center font-mono text-xs text-gray-500">
                <span className="w-16 text-sky-600">Params</span>
                <span>?limit=10&amp;sort=desc</span>
              </div>
            </div>
          </div>
        </FloatingCard>

        <FloatingCard
          className="w-80 rounded-3xl bg-orange-100 p-6 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05),0_0_20px_0_rgba(0,0,0,0.02)] transition-transform duration-300 hover:scale-105 hover:shadow-[0_30px_60px_-20px_rgba(0,0,0,0.1),0_0_20px_0_rgba(0,0,0,0.02)]"
          style={{ top: "14%", right: "6%", zIndex: 11, ["--rotation" as string]: "3deg", animationDelay: "-1.5s" }}
        >
          <div className="mb-4 inline-block rounded-full bg-orange-200/50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-orange-800">
            Mock Endpoint
          </div>
          <h3 className="mb-3 text-lg font-bold leading-tight text-gray-900">Your API is ready!</h3>
          <div className="flex items-center rounded-xl border border-orange-100 bg-white p-1 shadow-sm">
            <div className="flex-1 overflow-hidden px-3 font-mono text-sm text-gray-600">https://mock.apideck.com/gk8v2...</div>
            <button
              type="button"
              className="flex-shrink-0 rounded-lg bg-orange-100 p-2 text-orange-700 transition-colors hover:bg-orange-200"
              title="Copy URL"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
            </button>
          </div>
          <div className="mt-4 flex gap-2">
            <span className="mt-1.5 h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            <span className="text-xs font-medium text-orange-800/80">Live and accepting requests.</span>
          </div>
        </FloatingCard>

        <FloatingCard
          className="w-72 rounded-3xl bg-emerald-100 p-6 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05),0_0_20px_0_rgba(0,0,0,0.02)] transition-transform duration-300 hover:scale-105 hover:shadow-[0_30px_60px_-20px_rgba(0,0,0,0.1),0_0_20px_0_rgba(0,0,0,0.02)]"
          style={{ bottom: "6%", left: "8%", zIndex: 12, ["--rotation" as string]: "5deg", animationDelay: "-3s" }}
        >
          <div className="mb-4 inline-block rounded-full bg-emerald-200/50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-800">
            Data Schema
          </div>
          <div className="rounded-2xl border border-emerald-100 bg-white/60 p-4 shadow-sm backdrop-blur-sm">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-bold text-gray-800">Product Object</span>
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 font-mono text-[10px] text-emerald-700">
                12 fields
              </span>
            </div>
            <ul className="space-y-2 font-mono text-sm text-gray-600">
              <li className="flex items-center justify-between border-b border-emerald-100/50 pb-1">
                <span className="font-semibold text-gray-800">id</span>
                <span className="text-xs text-emerald-600">UUID</span>
              </li>
              <li className="flex items-center justify-between border-b border-emerald-100/50 pb-1">
                <span className="font-semibold text-gray-800">title</span>
                <span className="text-xs text-emerald-600">String</span>
              </li>
              <li className="flex items-center justify-between border-b border-emerald-100/50 pb-1">
                <span className="font-semibold text-gray-800">price</span>
                <span className="text-xs text-emerald-600">Float</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="font-semibold text-gray-800">in_stock</span>
                <span className="text-xs text-emerald-600">Boolean</span>
              </li>
            </ul>
          </div>
        </FloatingCard>

        <FloatingCard
          className="w-80 rounded-3xl bg-purple-100 p-6 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05),0_0_20px_0_rgba(0,0,0,0.02)] transition-transform duration-300 hover:scale-105 hover:shadow-[0_30px_60px_-20px_rgba(0,0,0,0.1),0_0_20px_0_rgba(0,0,0,0.02)]"
          style={{ bottom: "4%", right: "8%", zIndex: 13, ["--rotation" as string]: "-2deg", animationDelay: "-4.5s" }}
        >
          <div className="mb-4 flex items-center justify-between">
            <div className="inline-block rounded-full bg-purple-200/50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-purple-800">
              Response Preview
            </div>
            <div className="flex gap-1">
              <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
              <div className="h-2.5 w-2.5 rounded-full bg-amber-400" />
              <div className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
            </div>
          </div>
          <div className="overflow-hidden rounded-2xl bg-gray-900 p-4 shadow-inner">
            <pre className="text-xs leading-relaxed">
              <code className="font-mono">
                <span className="text-gray-500">{"{"}</span>
                {"\n  "}
                <span className="text-pink-600">&quot;status&quot;</span>
                <span className="text-gray-500">: </span>
                <span className="text-blue-600">200</span>
                <span className="text-gray-500">,</span>
                {"\n  "}
                <span className="text-pink-600">&quot;message&quot;</span>
                <span className="text-gray-500">: </span>
                <span className="text-emerald-600">&quot;Success&quot;</span>
                <span className="text-gray-500">,</span>
                {"\n  "}
                <span className="text-pink-600">&quot;data&quot;</span>
                <span className="text-gray-500">: [</span>
                {"\n    "}
                <span className="text-gray-500">{"{"}</span>
                {"\n      "}
                <span className="text-pink-600">&quot;id&quot;</span>
                <span className="text-gray-500">: </span>
                <span className="text-emerald-600">&quot;8f7b3a...&quot;</span>
                <span className="text-gray-500">,</span>
                {"\n      "}
                <span className="text-pink-600">&quot;title&quot;</span>
                <span className="text-gray-500">: </span>
                <span className="text-emerald-600">&quot;Coffee Mug&quot;</span>
                <span className="text-gray-500">,</span>
                {"\n      "}
                <span className="text-pink-600">&quot;price&quot;</span>
                <span className="text-gray-500">: </span>
                <span className="text-blue-600">12.99</span>
                {"\n    "}
                <span className="text-gray-500">{"}"}</span>
                {"\n  "}
                <span className="text-gray-500">]</span>
                {"\n"}
                <span className="text-gray-500">{"}"}</span>
              </code>
            </pre>
          </div>
        </FloatingCard>

        <div
          className="pointer-events-none absolute inset-0 z-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
      </main>

      <div className="relative z-20 mx-auto w-full max-w-6xl px-6 pb-16">
        <section id="documentation" className="mb-10 scroll-mt-28">
          <h2 className="mb-5 text-xs font-bold uppercase tracking-widest text-gray-400">Documentation</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl bg-sky-100 p-6 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]">
              <h3 className="mb-2 text-sm font-semibold text-gray-900">Create mock endpoint</h3>
              <p className="text-sm text-gray-600">Describe your data in plain English and generate an endpoint in one step.</p>
            </div>
            <div className="rounded-3xl bg-emerald-100 p-6 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]">
              <h3 className="mb-2 text-sm font-semibold text-gray-900">Schema preview</h3>
              <p className="text-sm text-gray-600">Review generated schema output before integrating into your app.</p>
            </div>
            <div className="rounded-3xl bg-purple-100 p-6 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]">
              <h3 className="mb-2 text-sm font-semibold text-gray-900">Use endpoint instantly</h3>
              <p className="text-sm text-gray-600">Call the generated `/api/mock/{'{slug}'}` URL immediately from frontend or backend.</p>
            </div>
          </div>
        </section>

        <section id="examples" className="scroll-mt-28">
          <h2 className="mb-5 text-xs font-bold uppercase tracking-widest text-gray-400">Examples</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]">
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-gray-400">E-commerce</p>
              <code className="block rounded-xl bg-gray-900 p-4 text-xs text-gray-100">
                A list of 20 products with id, name, price, image and in_stock.
              </code>
            </div>
            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]">
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-gray-400">SaaS</p>
              <code className="block rounded-xl bg-gray-900 p-4 text-xs text-gray-100">
                A list of subscriptions with id, plan_name, status, renewal_date and monthly_price.
              </code>
            </div>
          </div>
        </section>
      </div>

      <style jsx global>{`
        .floating-card {
          animation: float 6s ease-in-out infinite;
          will-change: transform;
        }

        .floating-card:hover {
          animation-play-state: paused;
          z-index: 50 !important;
        }

        @keyframes float {
          0% {
            transform: translateY(0px) rotate(var(--rotation));
          }
          50% {
            transform: translateY(-15px) rotate(calc(var(--rotation) + 2deg));
          }
          100% {
            transform: translateY(0px) rotate(var(--rotation));
          }
        }

        .mock-api-textarea::-webkit-scrollbar {
          width: 6px;
        }

        .mock-api-textarea::-webkit-scrollbar-track {
          background: transparent;
        }

        .mock-api-textarea::-webkit-scrollbar-thumb {
          background-color: #e5e7eb;
          border-radius: 10px;
        }

        .generate-dots {
          display: inline-flex;
          align-items: flex-end;
          gap: 4px;
          height: 14px;
        }

        .generate-dots span {
          width: 5px;
          height: 5px;
          border-radius: 999px;
          background: currentColor;
          animation: jump-dot 0.7s ease-in-out infinite;
        }

        .generate-dots span:nth-child(2) {
          animation-delay: 0.12s;
        }

        .generate-dots span:nth-child(3) {
          animation-delay: 0.24s;
        }

        @keyframes jump-dot {
          0%,
          100% {
            transform: translateY(0);
            opacity: 0.7;
          }
          50% {
            transform: translateY(-4px);
            opacity: 1;
          }
        }
      `}</style>
      </section>
    </div>
  );
}
