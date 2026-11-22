/**
 * Loads the numbered bicycle image sequence.
 * Expected files:
 * public/sequences/bicycle/ezgif-frame-001.jpg ... ezgif-frame-050.jpg
 */
export async function preloadBicycleFrames(
  totalFrames: number,
  onProgress?: (loaded: number, total: number) => void
): Promise<HTMLImageElement[]> {
  let loaded = 0;

  const loadOne = (index: number): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const padded = String(index).padStart(3, "0");
      const image = new Image();
      image.decoding = "async";
      image.onload = async () => {
        try {
          if (typeof image.decode === "function") await image.decode();
        } catch {
          // onload already confirms that the image is usable.
        }
        loaded += 1;
        onProgress?.(loaded, totalFrames);
        resolve(image);
      };
      image.onerror = () => {
        reject(new Error(`Missing bicycle frame: ezgif-frame-${padded}.webp`));
      };
      image.src = `/sequences/bicycle/ezgif-frame-${padded}.webp`;
    });

  // Keep the original order so scroll progress maps to the correct frame.
  const images = await Promise.all(
    Array.from({ length: totalFrames }, (_, index) => loadOne(index + 1))
  );

  return images;
}
