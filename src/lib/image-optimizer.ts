/**
 * Browser-side Image Optimizer & Compressor
 * Automatically compresses raw camera/phone photos (2MB - 10MB) down to ~80KB - 180KB WebP
 * preserving high visual quality while dramatically saving bandwidth and Supabase storage.
 */

export interface CompressionResult {
  file: File;
  originalSize: number;
  compressedSize: number;
  savingsPercent: number;
}

export async function compressImage(
  file: File,
  options: {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
    format?: 'image/webp' | 'image/jpeg';
  } = {}
): Promise<CompressionResult> {
  const {
    maxWidth = 1600,
    maxHeight = 1200,
    quality = 0.82,
    format = 'image/webp'
  } = options;

  const originalSize = file.size;

  // Don't compress non-images or animated GIFs or SVGs
  if (!file.type.startsWith('image/') || file.type === 'image/gif' || file.type === 'image/svg+xml') {
    return {
      file,
      originalSize,
      compressedSize: originalSize,
      savingsPercent: 0
    };
  }

  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate scaled dimensions while preserving aspect ratio
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve({
            file,
            originalSize,
            compressedSize: originalSize,
            savingsPercent: 0
          });
          return;
        }

        // Draw image with high quality smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Export to WebP with target quality
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve({
                file,
                originalSize,
                compressedSize: originalSize,
                savingsPercent: 0
              });
              return;
            }

            // If compressed blob is somehow larger than original, keep original
            if (blob.size >= originalSize) {
              resolve({
                file,
                originalSize,
                compressedSize: originalSize,
                savingsPercent: 0
              });
              return;
            }

            const extension = format === 'image/webp' ? '.webp' : '.jpg';
            const baseName = file.name.replace(/\.[^/.]+$/, '');
            const newName = `${baseName}${extension}`;

            const compressedFile = new File([blob], newName, {
              type: format,
              lastModified: Date.now()
            });

            const savingsPercent = Math.round(((originalSize - blob.size) / originalSize) * 100);

            resolve({
              file: compressedFile,
              originalSize,
              compressedSize: blob.size,
              savingsPercent
            });
          },
          format,
          quality
        );
      };

      img.onerror = () => {
        resolve({
          file,
          originalSize,
          compressedSize: originalSize,
          savingsPercent: 0
        });
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = () => {
      resolve({
        file,
        originalSize,
        compressedSize: originalSize,
        savingsPercent: 0
      });
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Format bytes to readable KB/MB string
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}
