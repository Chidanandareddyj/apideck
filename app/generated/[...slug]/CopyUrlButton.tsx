'use client';

type CopyUrlButtonProps = {
  url: string;
};

export default function CopyUrlButton({ url }: CopyUrlButtonProps) {
  const handleCopy = async (): Promise<void> => {
    await navigator.clipboard.writeText(url);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="flex flex-shrink-0 items-center gap-3 rounded-xl bg-gray-900 p-4 text-white shadow-lg shadow-gray-900/10 transition-all hover:bg-gray-800 active:scale-95"
    >
      <span className="pr-1 text-sm font-semibold">Copy URL</span>
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
      </svg>
    </button>
  );
}
