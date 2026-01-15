
import Link from 'next/link';
import { getPromoBanner } from '@/lib/promo-banner';
import { cn } from '@/lib/utils';

export async function PromoBanner() {
  const banner = await getPromoBanner();

  if (!banner || !banner.isActive) {
    return null;
  }

  const Tag = banner.link ? Link : 'div';
  const props = banner.link ? { href: banner.link } : {};
  
  const bannerStyle = {
    backgroundColor: banner.backgroundColor,
    color: banner.textColor,
  };

  return (
    <Tag
      {...props}
      style={bannerStyle}
      className={cn(
        "relative flex h-10 w-full items-center justify-center overflow-hidden",
        banner.link && "transition-opacity hover:opacity-90"
      )}
    >
      <div className="absolute flex animate-marquee whitespace-nowrap">
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} className="mx-4 text-sm font-medium">
            {banner.text}
          </span>
        ))}
      </div>
    </Tag>
  );
}
