"use client";

import { useMemo, useState } from 'react';

type ShareBarProps = {
  title: string;
  url: string;
  description?: string;
};

export function ShareBar({ title, url, description }: ShareBarProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl = useMemo(() => encodeURIComponent(url), [url]);
  const shareText = useMemo(() => encodeURIComponent(description ? `${title} - ${description}` : title), [title, description]);

  const copyLink = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const nativeShare = async () => {
    if (navigator.share) {
      await navigator.share({ title, text: description ?? title, url });
      return;
    }
    await copyLink();
  };

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={nativeShare}
        className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-brand-onSurface transition hover:bg-brand-surfaceLow"
      >
        <ShareIcon />
        Share
      </button>
      <button
        type="button"
        onClick={copyLink}
        className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-brand-onSurface transition hover:bg-brand-surfaceLow"
      >
        <CopyIcon />
        {copied ? 'Copied' : 'Copy link'}
      </button>
      <a
        href={`https://wa.me/?text=${shareText}%20${shareUrl}`}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-brand-onSurface transition hover:bg-brand-surfaceLow"
      >
        <WhatsAppIcon />
        WhatsApp
      </a>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-brand-onSurface transition hover:bg-brand-surfaceLow"
      >
        <FacebookIcon />
        Facebook
      </a>
      <a
        href={`https://x.com/intent/tweet?text=${shareText}&url=${shareUrl}`}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-brand-onSurface transition hover:bg-brand-surfaceLow"
      >
        <XIcon />
        X
      </a>
    </div>
  );
}

function IconShell({ children }: { children: React.ReactNode }) {
  return <span className="inline-flex h-4 w-4 items-center justify-center text-current">{children}</span>;
}

function ShareIcon() {
  return (
    <IconShell>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 16v-8" />
        <path d="m8 12 4-4 4 4" />
        <path d="M20 15v3a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-3" />
      </svg>
    </IconShell>
  );
}

function CopyIcon() {
  return (
    <IconShell>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="9" y="9" width="11" height="11" rx="2" />
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
      </svg>
    </IconShell>
  );
}

function WhatsAppIcon() {
  return (
    <IconShell>
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M20.5 3.5A11.7 11.7 0 0 0 12.1 0C5.7 0 .5 5.2.5 11.6c0 2.1.6 4.1 1.7 5.9L0 24l6.7-2.1a11.7 11.7 0 0 0 5.4 1.4h.1c6.4 0 11.6-5.2 11.6-11.6 0-3.1-1.2-6.1-3.3-8.2Zm-8.4 18.4h-.1a9.7 9.7 0 0 1-4.9-1.3l-.4-.2-4 1.2 1.2-3.9-.2-.4a9.7 9.7 0 0 1-1.5-5.2C2.2 6 6.4 1.8 11.6 1.8c2.8 0 5.4 1.1 7.4 3.1a9.8 9.8 0 0 1 3 7c0 5.2-4.2 10-9.9 10Zm5.7-7.4c-.3-.1-1.8-.9-2.1-1s-.5-.1-.7.1-.8 1-.9 1.2-.3.2-.6.1a8 8 0 0 1-2.4-1.5 8.9 8.9 0 0 1-1.7-2.1c-.2-.3 0-.5.1-.7l.5-.6c.1-.2.1-.4.2-.6s0-.4 0-.6-.7-1.7-1-2.3c-.2-.5-.5-.4-.7-.4h-.6c-.2 0-.6.1-.9.4s-1 1-1 2.3 1 2.6 1.1 2.8a12.5 12.5 0 0 0 4.7 4.7c.7.4 1.2.7 1.6.9.7.3 1.3.2 1.8.1.6-.1 1.8-.8 2.1-1.5s.3-1.2.2-1.3-.3-.2-.6-.3Z" />
      </svg>
    </IconShell>
  );
}

function FacebookIcon() {
  return (
    <IconShell>
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M13.5 22v-8h2.7l.4-3H13.5V8.1c0-.9.2-1.6 1.7-1.6H16.7V3.8c-.4 0-1.5-.1-2.9-.1-2.8 0-4.8 1.7-4.8 4.8V11H6.3v3h2.7v8h4.5Z" />
      </svg>
    </IconShell>
  );
}

function XIcon() {
  return (
    <IconShell>
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18.9 2H22l-6.8 7.8L23 22h-6.9l-5.4-6.9L4.5 22H1.4l7.3-8.4L1 2h7.1l4.9 6.2L18.9 2Zm-1.2 18h1.9L7.2 3.9H5.1L17.7 20Z" />
      </svg>
    </IconShell>
  );
}
