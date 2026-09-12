"use client";

import React, { useEffect, useState } from 'react';

interface ArticleBodyProps {
  content?: string | null;
  className?: string;
}

type Block =
  | { type: 'heading2'; text: string }
  | { type: 'heading3'; text: string }
  | { type: 'quote'; text: string }
  | { type: 'divider' }
  | { type: 'youtube'; videoId: string }
  | { type: 'table'; headers: string[]; rows: string[][] }
  | { type: 'list'; ordered: boolean; items: string[] }
  | { type: 'gallery'; images: Array<{ url: string; caption?: string }> }
  | { type: 'image'; url: string; caption?: string }
  | { type: 'paragraph'; text: string };

function extractYouTubeId(urlOrText: string): string | null {
  const match = urlOrText.match(
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i
  );
  return match ? match[1] : null;
}

function parseArticleBlocks(rawText: string): Block[] {
  if (!rawText) return [];

  // Normalize newlines
  const normalized = rawText.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const rawParagraphs = normalized.split(/\n{2,}/);

  const blocks: Block[] = [];

  for (const p of rawParagraphs) {
    const trimmed = p.trim();
    if (!trimmed) continue;

    // Check if it's a divider
    if (/^(\-{3,}|\*{3,}|_{3,})$/.test(trimmed)) {
      blocks.push({ type: 'divider' });
      continue;
    }

    // Check if it's a standalone YouTube video link
    const ytId = extractYouTubeId(trimmed);
    if (ytId && (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('www.') || trimmed.includes('<iframe'))) {
      blocks.push({ type: 'youtube', videoId: ytId });
      continue;
    }

    // Check if it's a Markdown Table
    const lines = trimmed.split('\n').map((l) => l.trim()).filter(Boolean);
    if (lines.length >= 2 && lines[0].startsWith('|') && lines[0].endsWith('|') && lines[1].includes('---')) {
      const headers = lines[0].slice(1, -1).split('|').map((h) => h.trim());
      const rows = lines.slice(2).map((line) => {
        const clean = line.startsWith('|') && line.endsWith('|') ? line.slice(1, -1) : line;
        return clean.split('|').map((c) => c.trim());
      });
      blocks.push({ type: 'table', headers, rows });
      continue;
    }

    // Check if it's an Unordered List
    if (lines.length > 0 && lines.every((line) => /^[-*•]\s+/.test(line))) {
      const items = lines.map((line) => line.replace(/^[-*•]\s+/, '').trim());
      blocks.push({ type: 'list', ordered: false, items });
      continue;
    }

    // Check if it's an Ordered List
    if (lines.length > 0 && lines.every((line) => /^\d+\.\s+/.test(line))) {
      const items = lines.map((line) => line.replace(/^\d+\.\s+/, '').trim());
      blocks.push({ type: 'list', ordered: true, items });
      continue;
    }

    // Check if it's a H2 Heading (## )
    if (trimmed.startsWith('## ')) {
      blocks.push({ type: 'heading2', text: trimmed.replace(/^##\s+/, '') });
      continue;
    }

    // Check if it's a H3 Heading (### )
    if (trimmed.startsWith('### ')) {
      blocks.push({ type: 'heading3', text: trimmed.replace(/^###\s+/, '') });
      continue;
    }

    // Check if it's a Blockquote (> )
    if (trimmed.startsWith('>')) {
      const quoteText = trimmed
        .split('\n')
        .map((line) => line.replace(/^>\s?/, ''))
        .join(' ');
      blocks.push({ type: 'quote', text: quoteText });
      continue;
    }

    // Check for explicit [gallery] ... [/gallery] block
    const galleryBlockMatch = trimmed.match(/^\[gallery\]([\s\S]*?)\[\/gallery\]$/i);
    if (galleryBlockMatch) {
      const inner = galleryBlockMatch[1];
      const gImages: Array<{ url: string; caption?: string }> = [];
      const imgRegex = /!\[([^\]]*)\]\(([^)]+)\)|\[image:\s*([^\s|\]]+)(?:\s*\|\s*([^\]]*))?\]/gi;
      let m: RegExpExecArray | null;
      while ((m = imgRegex.exec(inner)) !== null) {
        if (m[2]) {
          gImages.push({ caption: m[1]?.trim() || undefined, url: m[2].trim() });
        } else if (m[3]) {
          gImages.push({ url: m[3].trim(), caption: m[4]?.trim() || undefined });
        }
      }
      if (gImages.length > 0) {
        blocks.push({ type: 'gallery', images: gImages });
        continue;
      }
    }

    // Check for images in this paragraph block
    const lineImages: Array<{ url: string; caption?: string }> = [];
    const nonImageLines: string[] = [];

    for (const line of lines) {
      // Regex for Markdown Image: ![caption](url)
      const mdImgMatch = line.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
      if (mdImgMatch) {
        lineImages.push({ caption: mdImgMatch[1]?.trim() || undefined, url: mdImgMatch[2].trim() });
        continue;
      }

      // Regex for [image: url | caption]
      const shortcodeMatch = line.match(/^\[image:\s*([^\s|\]]+)(?:\s*\|\s*([^\]]*))?\]$/i);
      if (shortcodeMatch) {
        lineImages.push({ url: shortcodeMatch[1].trim(), caption: shortcodeMatch[2]?.trim() || undefined });
        continue;
      }

      // Regex for direct standalone image URL
      const directUrlMatch = line.match(/^(https?:\/\/[^\s]+?\.(?:png|jpe?g|webp|gif|svg)(\?[^\s]*)?)$/i);
      if (directUrlMatch) {
        lineImages.push({ url: directUrlMatch[1].trim() });
        continue;
      }

      nonImageLines.push(line);
    }

    // If the whole chunk consists solely of images:
    if (lineImages.length > 0 && nonImageLines.length === 0) {
      if (lineImages.length === 1) {
        blocks.push({ type: 'image', url: lineImages[0].url, caption: lineImages[0].caption });
      } else {
        blocks.push({ type: 'gallery', images: lineImages });
      }
      continue;
    }

    // If there is mixed text and images, check for inline ![caption](url) within text
    const mdImgGlobal = /!\[([^\]]*)\]\(([^)]+)\)/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;
    let hasInlineImages = false;

    while ((match = mdImgGlobal.exec(trimmed)) !== null) {
      hasInlineImages = true;
      const textBefore = trimmed.slice(lastIndex, match.index).trim();
      if (textBefore) {
        blocks.push({ type: 'paragraph', text: textBefore });
      }
      blocks.push({
        type: 'image',
        caption: match[1]?.trim() || undefined,
        url: match[2].trim()
      });
      lastIndex = mdImgGlobal.lastIndex;
    }

    if (hasInlineImages) {
      const textAfter = trimmed.slice(lastIndex).trim();
      if (textAfter) {
        blocks.push({ type: 'paragraph', text: textAfter });
      }
      continue;
    }

    // Standard paragraph
    blocks.push({ type: 'paragraph', text: trimmed });
  }

  // Second pass: Merge consecutive standalone image blocks into a unified gallery block
  const mergedBlocks: Block[] = [];
  let pendingImages: Array<{ url: string; caption?: string }> = [];

  for (const block of blocks) {
    if (block.type === 'image') {
      pendingImages.push({ url: block.url, caption: block.caption });
    } else {
      if (pendingImages.length > 1) {
        mergedBlocks.push({ type: 'gallery', images: pendingImages });
      } else if (pendingImages.length === 1) {
        mergedBlocks.push({ type: 'image', url: pendingImages[0].url, caption: pendingImages[0].caption });
      }
      pendingImages = [];
      mergedBlocks.push(block);
    }
  }

  if (pendingImages.length > 1) {
    mergedBlocks.push({ type: 'gallery', images: pendingImages });
  } else if (pendingImages.length === 1) {
    mergedBlocks.push({ type: 'image', url: pendingImages[0].url, caption: pendingImages[0].caption });
  }

  return mergedBlocks;
}

export function ArticleBody({ content, className = '' }: ArticleBodyProps) {
  const [activeLightbox, setActiveLightbox] = useState<{
    images: Array<{ url: string; caption?: string }>;
    index: number;
  } | null>(null);

  useEffect(() => {
    if (!activeLightbox) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveLightbox(null);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
        // Next in RTL
        setActiveLightbox((prev) => {
          if (!prev || prev.images.length <= 1) return prev;
          return { ...prev, index: (prev.index + 1) % prev.images.length };
        });
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
        // Previous in RTL
        setActiveLightbox((prev) => {
          if (!prev || prev.images.length <= 1) return prev;
          return { ...prev, index: (prev.index - 1 + prev.images.length) % prev.images.length };
        });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeLightbox]);

  if (!content) {
    return <p className="text-gray-500 italic py-4">لا يوجد محتوى لهذا المقال.</p>;
  }

  const blocks = parseArticleBlocks(content);

  return (
    <div className={`article-content space-y-6 text-[#222] font-normal leading-relaxed sm:leading-loose text-base sm:text-lg md:text-xl max-w-full break-words ${className}`}>
      {blocks.map((block, idx) => {
        switch (block.type) {
          case 'heading2':
            return (
              <h2
                key={idx}
                dir="auto"
                className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-950 mt-8 mb-4 pr-3 border-r-4 border-[#bb1919] leading-snug break-words [overflow-wrap:anywhere]"
              >
                {block.text}
              </h2>
            );

          case 'heading3':
            return (
              <h3
                key={idx}
                dir="auto"
                className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mt-6 mb-3 pr-2 border-r-2 border-[#bb1919] leading-snug break-words [overflow-wrap:anywhere]"
              >
                {block.text}
              </h3>
            );

          case 'quote':
            return (
              <blockquote
                key={idx}
                dir="auto"
                className="my-6 p-4 md:p-6 bg-[#fdf8f8] border-r-4 border-[#bb1919] rounded-r text-gray-800 italic font-semibold text-base sm:text-lg md:text-xl leading-relaxed sm:leading-loose shadow-sm break-words [overflow-wrap:anywhere]"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl sm:text-3xl text-[#bb1919] leading-none select-none font-serif">“</span>
                  <div className="flex-1">{block.text}</div>
                </div>
              </blockquote>
            );

          case 'divider':
            return (
              <hr key={idx} className="my-8 border-t border-gray-200" />
            );

          case 'youtube':
            return (
              <div key={idx} className="my-6 w-full overflow-hidden rounded-md bg-black shadow-md">
                <div className="relative w-full aspect-video">
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${block.videoId}`}
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full border-0"
                    loading="lazy"
                  />
                </div>
              </div>
            );

          case 'table':
            return (
              <div key={idx} className="my-6 w-full overflow-x-auto border border-gray-200 rounded-md bg-white shadow-sm scrollbar-none">
                <table className="min-w-full divide-y divide-gray-200 text-sm sm:text-base text-right" dir="auto">
                  {block.headers.length > 0 && (
                    <thead className="bg-gray-50">
                      <tr>
                        {block.headers.map((h, i) => (
                          <th key={i} className="px-4 py-3 font-bold text-gray-900 border-b border-gray-200">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                  )}
                  <tbody className="divide-y divide-gray-100">
                    {block.rows.map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-gray-50/80 transition">
                        {row.map((cell, cIdx) => (
                          <td key={cIdx} className="px-4 py-3 text-gray-700 whitespace-normal break-words">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );

          case 'list':
            return block.ordered ? (
              <ol key={idx} dir="auto" className="my-5 space-y-2 list-decimal list-inside text-gray-800 text-base sm:text-lg leading-relaxed sm:leading-loose pr-2">
                {block.items.map((item, lIdx) => (
                  <li key={lIdx} className="break-words [overflow-wrap:anywhere]">{item}</li>
                ))}
              </ol>
            ) : (
              <ul key={idx} dir="auto" className="my-5 space-y-2 list-disc list-inside text-gray-800 text-base sm:text-lg leading-relaxed sm:leading-loose pr-2">
                {block.items.map((item, lIdx) => (
                  <li key={lIdx} className="break-words [overflow-wrap:anywhere]">{item}</li>
                ))}
              </ul>
            );

          case 'image':
            return (
              <figure key={idx} className="my-6 sm:my-8 group">
                <div
                  className="relative w-full rounded-md overflow-hidden bg-gray-100 border border-gray-200 cursor-pointer shadow-sm transition hover:shadow-md"
                  onClick={() => setActiveLightbox({ images: [{ url: block.url, caption: block.caption }], index: 0 })}
                >
                  <img
                    src={block.url}
                    alt={block.caption || 'صورة من المقال'}
                    className="w-full h-auto max-h-[650px] object-contain mx-auto transition duration-300 group-hover:scale-[1.01]"
                    loading="lazy"
                  />
                  <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white px-2.5 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition flex items-center gap-1.5 pointer-events-none">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                    </svg>
                    <span>تكبير الصورة</span>
                  </div>
                </div>
                {block.caption && (
                  <figcaption dir="auto" className="mt-2 text-xs sm:text-sm text-gray-600 flex items-center gap-2 pr-1 font-sans break-words [overflow-wrap:anywhere]">
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gray-200 text-[#bb1919] text-[11px] shrink-0">
                      📷
                    </span>
                    <span>{block.caption}</span>
                  </figcaption>
                )}
              </figure>
            );

          case 'gallery':
            return (
              <div key={idx} className="my-6 sm:my-8">
                <div className={`grid gap-3 ${
                  block.images.length === 2
                    ? 'grid-cols-1 sm:grid-cols-2'
                    : block.images.length === 3
                    ? 'grid-cols-1 sm:grid-cols-3'
                    : block.images.length === 4
                    ? 'grid-cols-2 sm:grid-cols-2 md:grid-cols-4'
                    : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
                }`}>
                  {block.images.map((img, i) => (
                    <figure key={i} className="group flex flex-col">
                      <div
                        className="relative w-full aspect-[4/3] rounded-md overflow-hidden bg-gray-100 border border-gray-200 cursor-pointer shadow-sm transition hover:shadow-md"
                        onClick={() => setActiveLightbox({ images: block.images, index: i })}
                      >
                        <img
                          src={img.url}
                          alt={img.caption || `صورة رقم ${i + 1}`}
                          className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded text-[11px] opacity-0 group-hover:opacity-100 transition flex items-center gap-1 pointer-events-none">
                          <span>تكبير 🔍</span>
                        </div>
                        <div className="absolute top-2 right-2 bg-black/50 text-white text-[10px] font-bold px-1.5 py-0.5 rounded pointer-events-none">
                          {i + 1}
                        </div>
                      </div>
                      {img.caption && (
                        <figcaption dir="auto" className="mt-1.5 text-xs text-gray-600 line-clamp-2 pr-1 break-words">
                          📷 {img.caption}
                        </figcaption>
                      )}
                    </figure>
                  ))}
                </div>
              </div>
            );

          case 'paragraph':
          default:
            return (
              <p
                key={idx}
                dir="auto"
                className="whitespace-pre-wrap text-gray-800 leading-relaxed sm:leading-loose text-base sm:text-lg md:text-xl break-words [overflow-wrap:anywhere]"
              >
                {block.text}
              </p>
            );
        }
      })}

      {/* Fullscreen Lightbox Modal */}
      {activeLightbox && (() => {
        const currentImg = activeLightbox.images[activeLightbox.index] ?? activeLightbox.images[0];
        const hasMultiple = activeLightbox.images.length > 1;

        const goNext = () => {
          setActiveLightbox((prev) => {
            if (!prev) return null;
            return { ...prev, index: (prev.index + 1) % prev.images.length };
          });
        };

        const goPrev = () => {
          setActiveLightbox((prev) => {
            if (!prev) return null;
            return { ...prev, index: (prev.index - 1 + prev.images.length) % prev.images.length };
          });
        };

        return (
          <div
            className="fixed inset-0 z-[999] bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-2 sm:p-6 select-none"
            onClick={() => setActiveLightbox(null)}
            dir="rtl"
          >
            {/* Top Toolbar: Counter & Close */}
            <div className="absolute top-4 inset-x-4 z-50 flex items-center justify-between pointer-events-none">
              <div className="bg-black/60 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-bold pointer-events-auto">
                {hasMultiple ? `صورة ${activeLightbox.index + 1} من ${activeLightbox.images.length}` : 'معاينة الصورة'}
              </div>

              <button
                type="button"
                onClick={() => setActiveLightbox(null)}
                className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition text-xl font-bold pointer-events-auto shadow-lg"
                aria-label="إغلاق"
              >
                ✕
              </button>
            </div>

            {/* Main Image Container */}
            <div
              className="relative max-w-5xl max-h-[85vh] flex flex-col items-center justify-center p-2"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={currentImg.url}
                alt={currentImg.caption || 'صورة مكبرة'}
                className="max-w-full max-h-[75vh] object-contain rounded shadow-2xl transition-transform duration-200"
              />

              {/* Prev / Next Arrows */}
              {hasMultiple && (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      goPrev();
                    }}
                    className="absolute right-2 sm:-right-14 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center text-2xl font-bold transition shadow-xl border border-white/20"
                    title="السابق"
                  >
                    ›
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      goNext();
                    }}
                    className="absolute left-2 sm:-left-14 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center text-2xl font-bold transition shadow-xl border border-white/20"
                    title="التالي"
                  >
                    ‹
                  </button>
                </>
              )}

              {currentImg.caption && (
                <div dir="auto" className="mt-3 bg-black/80 backdrop-blur-sm px-4 py-2 rounded text-white text-xs sm:text-sm md:text-base text-center max-w-2xl break-words">
                  📷 {currentImg.caption}
                </div>
              )}
            </div>
          </div>
        );
      })()}
    </div>
  );
}

export default ArticleBody;

