'use client';

import { useEffect, useRef, useState } from "react";

type CopyUrlButtonProps = {
  url: string;
};

type CopyState = "idle" | "copied" | "error";

const resetDelayMs = 1800;

const fallbackCopyText = (value: string): boolean => {
  if (typeof document === "undefined") {
    return false;
  }

  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  textarea.style.pointerEvents = "none";
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();

  try {
    return document.execCommand("copy");
  } catch {
    return false;
  } finally {
    document.body.removeChild(textarea);
  }
};

export default function CopyUrlButton({ url }: CopyUrlButtonProps) {
  const [copyState, setCopyState] = useState<CopyState>("idle");
  const resetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimeoutRef.current) {
        clearTimeout(resetTimeoutRef.current);
      }
    };
  }, []);

  const queueReset = (): void => {
    if (resetTimeoutRef.current) {
      clearTimeout(resetTimeoutRef.current);
    }

    resetTimeoutRef.current = setTimeout(() => {
      setCopyState("idle");
    }, resetDelayMs);
  };

  const handleCopy = async (): Promise<void> => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        const didCopy = fallbackCopyText(url);
        if (!didCopy) {
          throw new Error("Clipboard API unavailable");
        }
      }

      setCopyState("idle");
      requestAnimationFrame(() => {
        setCopyState("copied");
      });
      queueReset();
    } catch {
      const didFallbackCopy = fallbackCopyText(url);
      setCopyState(didFallbackCopy ? "copied" : "error");
      queueReset();
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`flex flex-shrink-0 items-center gap-3 rounded-xl p-4 text-white shadow-lg transition-all active:scale-95 ${
        copyState === "copied"
          ? "copy-url-button-pop bg-emerald-500 shadow-emerald-500/25"
          : copyState === "error"
            ? "copy-url-button-shake bg-amber-500 shadow-amber-500/25"
            : "bg-gray-900 shadow-gray-900/10 hover:bg-gray-800"
      }`}
      aria-live="polite"
      aria-label={copyState === "copied" ? "URL copied" : copyState === "error" ? "Clipboard access denied" : "Copy URL"}
      title={copyState === "error" ? "Clipboard access was blocked. Copy the URL manually." : undefined}
    >
      <span className="pr-1 text-sm font-semibold">
        {copyState === "copied" ? "Copied!" : copyState === "error" ? "Copy blocked" : "Copy URL"}
      </span>
      {copyState === "copied" ? (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M20 6 9 17l-5-5" />
        </svg>
      ) : copyState === "error" ? (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.25"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v5" />
          <path d="M12 16h.01" />
        </svg>
      ) : (
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
      )}
    </button>
  );
}
