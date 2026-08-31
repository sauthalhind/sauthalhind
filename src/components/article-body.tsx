"use client";

import React, { useState } from 'react';

interface ArticleBodyProps {
  content?: string | null;
  className?: string;
}

type Block =
  | { type: 'heading2'; text: string }
  | { type: 'heading3'; text: string }
  | { type: 'quote'; text: string }
  | { type: 'divider' }
  | { type: 'gallery'; images: Array<{ url: string; caption?: string }> }
  | { type: 'image'; url: string; caption?: string }
  | { type: 'paragraph'; text: string };

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

    // Check for images in this paragraph block
    const lines = trimmed.split('\n').map((l) => l.trim()).filter(Boolean);
    const lineImages: Array<{ url: string; caption?: string }> = [];
    const nonImageLines: string[] = [];

    for (const line of lines) {
      // Regex for Markdown Image: ![caption](url)
      const mdImgMatch = line.match(/^!\[([^\]]*)\]\((https?:\/\/[^\s)]+|\/[^\s)]+)\)$/);
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

    // If there is mixed text and images or standard text, check for inline ![caption](url) within text
    const mdImgGlobal = /!\[([^\]]*)\]\((https?:\/\/[^\s)]+|\/[^\s)]+)\)/g;
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

  return blocks;
}

export function ArticleBody({ content, className = '' }: ArticleBodyProps) {
  const [activeLightbox, setActiveLightbox] = useState<{ url: string; caption?: string } | null>(null);

  if (!content) {
    return <p className="text-gray-500 italic">لا يوجد محتوى لهذا المقال.</p>;
  }

  const blocks = parseArticleBlocks(content);

  return (
    <div className={`article-content space-y-6 text-[#222] font-normal leading-relaxed sm:leading-loose text-lg md:text-xl ${className}`}>
      {blocks.map((block, idx) => {
        switch (block.type) {
          case 'heading2':
            return (
              <h2
                key={idx}
                className="text-2xl md:text-3xl font-bold text-gray-950 mt-8 mb-4 pr-3 border-r-4 border-[#bb1919] leading-snug"
              >
                {block.text}
              </h2>
            );

          case 'heading3':
            return (
              <h3
                key={idx}
                className="text-xl md:text-2xl font-bold text-gray-900 mt-6 mb-3 pr-2 border-r-2 border-[#bb1919] leading-snug"
              >
                {block.text}
              </h3>
            );

          case 'quote':
            return (
              <blockquote
                key={idx}
                className="my-6 p-4 md:p-6 bg-[#fdf8f8] border-r-4 border-[#bb1919] rounded-r text-gray-800 italic font-semibold text-lg md:text-xl leading-loose shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <span className="text-3xl text-[#bb1919] leading-none select-none font-serif">“</span>
                  <div className="flex-1">{block.text}</div>
                </div>
              </blockquote>
            );

          case 'divider':
            return (
              <hr key={idx} className="my-8 border-t border-gray-200" />
            );

          case 'image':
            return (
              <figure key={idx} className="my-8 group">
                <div
                  className="relative w-full rounded-md overflow-hidden bg-gray-100 border border-gray-200 cursor-pointer shadow-sm transition hover:shadow-md"
                  onClick={() => setActiveLightbox({ url: block.url, caption: block.caption })}
                >
                  <img
                    src={block.url}
                    alt={block.caption || 'صورة من المقال'}
                    className="w-full max-h-[550px] object-cover transition duration-300 group-hover:scale-[1.01]"
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
                  <figcaption className="mt-2 text-xs md:text-sm text-gray-600 flex items-center gap-2 pr-1 font-sans">
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
              <div key={idx} className="my-8">
                <div className={`grid gap-3 ${block.images.length === 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'}`}>
                  {block.images.map((img, i) => (
                    <figure key={i} className="group flex flex-col">
                      <div
                        className="relative w-full h-56 sm:h-64 rounded-md overflow-hidden bg-gray-100 border border-gray-200 cursor-pointer shadow-sm transition hover:shadow-md"
                        onClick={() => setActiveLightbox({ url: img.url, caption: img.caption })}
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
                      </div>
                      {img.caption && (
                        <figcaption className="mt-1.5 text-xs text-gray-600 line-clamp-2 pr-1">
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
              <p key={idx} className="text-gray-800 leading-relaxed sm:leading-loose text-lg md:text-xl">
                {block.text}
              </p>
            );
        }
      })}

      {/* Fullscreen Lightbox Modal */}
      {activeLightbox && (
        <div
          className="fixed inset-0 z-[999] bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center p-4 sm:p-6"
          onClick={() => setActiveLightbox(null)}
          dir="rtl"
        >
          <div className="absolute top-4 left-4 z-50 flex items-center gap-3">
            <button
              type="button"
              onClick={() => setActiveLightbox(null)}
              className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition text-xl font-bold"
              aria-label="Close modal"
            >
              ✕
            </button>
          </div>

          <div
            className="max-w-5xl max-h-[85vh] flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={activeLightbox.url}
              alt={activeLightbox.caption || 'صورة مكبرة'}
              className="max-w-full max-h-[75vh] object-contain rounded shadow-2xl"
            />
            {activeLightbox.caption && (
              <div className="mt-3 bg-black/75 px-4 py-2 rounded text-white text-sm md:text-base text-center max-w-2xl">
                📷 {activeLightbox.caption}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ArticleBody;
