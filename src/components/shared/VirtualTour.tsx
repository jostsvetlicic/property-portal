import { Play } from "lucide-react";

/**
 * Converts a YouTube / Vimeo / generic tour URL into an embeddable src.
 * Returns the original URL for anything already embeddable (Matterport, 360°
 * tour providers, direct /embed links).
 */
function toEmbedSrc(raw: string): string | null {
  const url = raw.trim();
  if (!url) return null;

  // YouTube: watch?v=, youtu.be/, /embed/, /shorts/
  const yt =
    url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;

  // Vimeo: vimeo.com/12345678
  const vm = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vm) return `https://player.vimeo.com/video/${vm[1]}`;

  // Already an embeddable URL (Matterport, other 360 providers, direct iframes).
  if (/^https?:\/\//.test(url)) return url;

  return null;
}

/**
 * Responsive 16:9 virtual-tour embed. Renders nothing when there is no valid
 * tour URL, so both detail layouts can drop it in unconditionally.
 */
export function VirtualTour({
  url,
  title,
}: {
  url: string | null | undefined;
  title: string;
}) {
  const src = url ? toEmbedSrc(url) : null;
  if (!src) return null;

  return (
    <div>
      <h2 className="flex items-center gap-3 font-display text-2xl text-cream">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/15">
          <Play className="h-4 w-4 text-accent" />
        </span>
        {title}
      </h2>
      <div className="mt-6 aspect-video w-full overflow-hidden rounded-[var(--radius-base)] ring-1 ring-cream/10">
        <iframe
          src={src}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen; xr-spatial-tracking"
          allowFullScreen
          loading="lazy"
          className="h-full w-full"
        />
      </div>
    </div>
  );
}
