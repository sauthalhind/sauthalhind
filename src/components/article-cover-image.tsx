"use client";

import { useState } from 'react';

type Props = {
  src: string;
  alt: string;
};

export default function ArticleCoverImage({ src, alt }: Props) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return null;
  }

  return (
    <div className="mb-8 relative w-full aspect-video max-h-[500px] overflow-hidden rounded-sm bg-gray-100">
      <img
        src={src}
        alt={alt}
        onError={() => setHasError(true)}
        className="w-full h-full object-cover"
      />
    </div>
  );
}
